import { SetMetadata } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: JwtPayload['role'][]) => SetMetadata(ROLES_KEY, roles);
