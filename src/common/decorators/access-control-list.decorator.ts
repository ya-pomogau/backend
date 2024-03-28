import { SetMetadata } from '@nestjs/common';
import { AccessRightsObject } from '../types/access-rights.types';
import { ACL_KEY } from '../constants/keys';

export const AccessControlList = (acl: AccessRightsObject) => SetMetadata(ACL_KEY, acl);
