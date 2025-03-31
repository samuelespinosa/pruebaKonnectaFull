import { Role } from '../enums/role.enum';

export interface JwtPayload {
  email: string;
  sub: number;
  role: Role;
}