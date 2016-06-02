import { Control } from '@angular/common';

/**
 * Class to be used to perform custom validation on various form components.
 */
export class CustomValidator {
  private validationFunction: (control: Control) => any;
  private validationErrorMessageMap: any;

  /**
   * @param validationFunction The validation function that should be executed when this
   *    validator is called.
   * @param validationErrorMessageMap A map of errors to the string that should be
   *    displayed when that error occurs.
   */
  constructor(validationFunction: (control: Control) => any,
              validationErrorMessageMap: any) {
    this.validationFunction = validationFunction;
    this.validationErrorMessageMap = validationErrorMessageMap;
  }

  getValidationFunction(): any {
    return this.validationFunction;
  }

  getErrorMessages(errors: any): string[] {
    let errorMessages = [];
    if (errors) {
      for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
          if (errors[key] && this.validationErrorMessageMap[key]) {
            errorMessages.push(this.validationErrorMessageMap[key]);
          }
        }
      }
    }

    if (errorMessages.length === 0) {
      errorMessages = undefined;
    }

    return errorMessages;
  }
}
