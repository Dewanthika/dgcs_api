import { SetMetadata } from '@nestjs/common';

export const IS_PERMISSION_KEY = 'isPermitted';
export const Permission = () => SetMetadata(IS_PERMISSION_KEY, true);