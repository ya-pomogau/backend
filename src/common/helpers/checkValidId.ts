import { BadRequestException } from '@nestjs/common';
import exceptions from '../constants/exceptions';

export default (id: string) => {
  const hex = /[0-9A-Fa-f]{6}/g;
  if (id.length !== 24 || !id.match(hex)) {
    throw new BadRequestException(exceptions.objectId.wrongId);
  }
};
