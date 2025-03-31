import { Role } from "src/shared/enums/role.enum";
export class UserPayloadDto {
    id: number;
    role: Role;
    email: string;
  }