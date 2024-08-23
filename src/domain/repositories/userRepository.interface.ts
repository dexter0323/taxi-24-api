import { UserM } from '../model/user';

export interface UserRepository {
  getUserByUsername(username: string): Promise<UserM>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
  insert(username: string, password: string): Promise<UserM>;
}
