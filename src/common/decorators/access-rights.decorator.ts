import { SetMetadata } from '@nestjs/common';
import { AccessRightsType } from '../types/access-rights.types';

export const AccessRights = (accessRights: Array<AccessRightsType>) =>
  SetMetadata('rights', accessRights);
