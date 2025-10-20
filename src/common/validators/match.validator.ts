// src/common/validators/match.validator.ts

import { 
    ValidationOptions, 
    registerDecorator, 
    ValidationArguments 
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          // Compara el valor actual (confirm_pass) con el valor de la propiedad relacionada (new_pass)
          return value === args.object[relatedPropertyName];
        },
        defaultMessage(args: ValidationArguments) {
          return `Las contraseñas no coinciden.`;
        },
      },
    });
  };
}