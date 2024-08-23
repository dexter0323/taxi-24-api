import { Body, Controller, Get, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthLoginDto, AuthSignUpDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';

import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/infrastructure/common/guards/jwtRefresh.guard';
import { LoginGuard } from 'src/infrastructure/common/guards/login.guard';
import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { IsAuthenticatedUseCases } from 'src/usecases/auth/isAuthenticated.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { SignUpUseCases as SignupUseCases } from 'src/usecases/auth/signup.usecases';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.SIGNUP_USECASES_PROXY)
    private readonly signupUsecaseProxy: UseCaseProxy<SignupUseCases>,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
  ) {}

  @Post('signup')
  @ApiBearerAuth()
  @ApiBody({ type: AuthSignUpDto })
  @ApiOperation({ description: 'sigup' })
  async sigup(@Body() auth: AuthSignUpDto, @Request() request: any) {
    const user = await this.signupUsecaseProxy.getInstance().execute(auth.username, auth.password);

    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(user.username);
    const refreshTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtRefreshToken(user.username);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return 'Signup successful';
  }

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() { username }: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(username);
    const refreshTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtRefreshToken(username);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return 'Login successful';
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecaseProxy.getInstance().execute();
    request.res.setHeader('Set-Cookie', cookie);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy.getInstance().execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(request.user.username);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Refresh successful';
  }
}
