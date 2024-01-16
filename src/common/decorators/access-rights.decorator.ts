import { SetMetadata } from '@nestjs/common';
import { AccessRightType } from '../types/access-rights.types';

export const AccessRights = (accessRights: Array<AccessRightType>) =>
  SetMetadata('rights', accessRights);
