import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'coords', async: false })
export class CoordsValidator implements ValidatorConstraintInterface {
  private isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public validate(value: [unknown, unknown], args: ValidationArguments): value is [number, number] {
    return Array.isArray(value) && value.length === 2 && value.every(this.isNumber);
  }
}

export function IsCoords(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types,func-names
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCoords',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CoordsValidator,
    });
  };
}
