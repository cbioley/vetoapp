import { Validation, ValidationError } from './lib/validation';

class AppValidation extends Validation {

  fewWordsAtLeast() {
    return this.validate(({ length }, prop) => {
      const minLength = 30;
      if (length >= minLength) return;
      throw new ValidationError('fewWordsAtLeast', { length, minLength, prop });
    });
  }

}

export default function validate(json) {
  return new AppValidation(json);
}
