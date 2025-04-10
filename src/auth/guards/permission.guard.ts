import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PERMISSION_KEY } from '../decorators/permission.decorator';
import { Permissions } from 'constant/permission.enum';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<boolean>(
      IS_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // const userPermissions: Permissions[] = user.permissions || [];

    // const hasPermission = [
    //   Permissions.READ,
    //   Permissions.CREATE,
    //   Permissions.DELETE,
    //   Permissions.UPDATE,
    // ].every((permission) => userPermissions.includes(permission));

    // if (!hasPermission) {
    //   throw new UnauthorizedException('Insufficient permissions');
    // }

    return true;
  }
}
