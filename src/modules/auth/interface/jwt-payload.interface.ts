export interface JwtPayload {
  sub: number;
  email: string;
  type: 'access' | 'refresh';
  role: 'admin' | 'user';
}
