import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

// interface ArgumentMetadata {
//   type: 'param';
// }

@Injectable()
export class ParamsIdValidationPipe implements PipeTransform {
  transform(value: Types.ObjectId) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${value} is not a valid ObjectId`);
    }
    return value;
  }
}
