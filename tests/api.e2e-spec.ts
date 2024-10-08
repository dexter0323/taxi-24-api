import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/infrastructure/common/guards/jwtRefresh.guard';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { IsAuthenticatedUseCases } from 'src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';

describe('infrastructure/controllers/auth', () => {
  let app: INestApplication;
  let loginUseCase: LoginUseCases;
  let isAuthenticatedUseCases: IsAuthenticatedUseCases;

  beforeAll(async () => {
    loginUseCase = {} as LoginUseCases;
    loginUseCase.getCookieWithJwtToken = jest.fn();
    loginUseCase.validateUserForLocalStrategy = jest.fn();
    loginUseCase.getCookieWithJwtRefreshToken = jest.fn();
    const loginUsecaseProxyService: UseCaseProxy<LoginUseCases> = {
      getInstance: () => loginUseCase,
    } as UseCaseProxy<LoginUseCases>;

    isAuthenticatedUseCases = {} as IsAuthenticatedUseCases;
    isAuthenticatedUseCases.execute = jest.fn();
    const isAuthUsecaseProxyService: UseCaseProxy<IsAuthenticatedUseCases> = {
      getInstance: () => isAuthenticatedUseCases,
    } as UseCaseProxy<IsAuthenticatedUseCases>;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
      .useValue(isAuthUsecaseProxyService)
      .overrideProvider(UsecasesProxyModule.LOGIN_USECASES_PROXY)
      .useValue(loginUsecaseProxyService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = { username: 'username' };
          return (
            JSON.stringify(req.cookies) ===
            JSON.stringify({
              Authentication: '123456',
              Path: '/',
              'Max-Age': '1800',
            })
          );
        },
      })
      .overrideGuard(JwtRefreshGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = { username: 'username' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it(`/POST login should return 201`, async () => {
    const createDate = new Date().toISOString();
    const updatedDate = new Date().toISOString();
    (loginUseCase.validateUserForLocalStrategy as jest.Mock).mockReturnValue(
      Promise.resolve({
        id: 1,
        username: 'username',
        createDate: createDate,
        updatedDate: updatedDate,
        lastLogin: null,
        hashRefreshToken: null,
      }),
    );
    (loginUseCase.getCookieWithJwtToken as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`,
      ),
    );
    (loginUseCase.getCookieWithJwtRefreshToken as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Refresh=12345; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
      ),
    );

    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'username', password: 'password' })
      .expect(201);

    expect(result.headers['set-cookie']).toEqual([
      `Authentication=123456; HttpOnly; Path=/; Max-Age=1800`,
      `Refresh=12345; HttpOnly; Path=/; Max-Age=86400`,
    ]);
  });

  it(`/POST logout should return 201`, async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', ['Authentication=123456; HttpOnly; Path=/; Max-Age=1800'])
      .send()
      .expect(201);

    expect(result.headers['set-cookie']).toEqual([
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]);
  });

  it(`/POST login should return 401`, async () => {
    (loginUseCase.validateUserForLocalStragtegy as jest.Mock).mockReturnValue(
      Promise.resolve(null),
    );

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'username', password: 'password' })
      .expect(401);
  });

  it(`/POST Refresh token should return 201`, async () => {
    (loginUseCase.getCookieWithJwtToken as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`,
      ),
    );

    const result = await request(app.getHttpServer()).get('/auth/refresh').send().expect(200);

    expect(result.headers['set-cookie']).toEqual([
      `Authentication=123456; HttpOnly; Path=/; Max-Age=1800`,
    ]);
  });

  it(`/GET is_authenticated should return 200`, async () => {
    (isAuthenticatedUseCases.execute as jest.Mock).mockReturnValue(
      Promise.resolve({ username: 'username' }),
    );

    await request(app.getHttpServer())
      .get('/auth/is_authenticated')
      .set('Cookie', ['Authentication=123456; HttpOnly; Path=/; Max-Age=1800'])
      .send()
      .expect(200);
  });

  it(`/GET is_authenticated should return 403`, async () => {
    (isAuthenticatedUseCases.execute as jest.Mock).mockReturnValue(
      Promise.resolve({ username: 'username' }),
    );

    await request(app.getHttpServer()).get('/auth/is_authenticated').send().expect(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
