import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';
import { Control, AbstractControl } from '@angular/common';
import { CustomValidator } from './custom-validator';

export function main() {
  'use strict';
  describe('Custom Validator', () => {
    let customValidator: CustomValidator;
    let testControl: Control;
    let errorMessage1: string;
    let errorMessage2: string;
    let errorMessageMap: any;

    beforeEach(() => {
      testControl = new Control('testString');
      errorMessage1 = 'errorMessage1';
      errorMessage2 = 'errorMessage2';
      errorMessageMap = {
        'illegal-value-error': errorMessage1,
        'another-illegal-value-error': errorMessage2
      };
    });

    it('should handle no errors correctly', () => {
      customValidator = new CustomValidator(
          (control: AbstractControl) => {
            return undefined;
          },
          {});

      let validator = customValidator.getValidationFunction();
      let errors = validator(testControl);
      expect(errors).toBe(undefined);
      expect(customValidator.getErrorMessages(errors)).toBe(undefined);
    });

    it('should handle one error correctly', () => {
      let validationResult = {'illegal-value-error': true};
      customValidator = new CustomValidator(
          (control: AbstractControl) => {
            return validationResult;
          },
          errorMessageMap);

      let validator = customValidator.getValidationFunction();
      let errors = validator(testControl);
      expect(errors).toBe(validationResult);
      expect(customValidator.getErrorMessages(errors).length).toBe(1);
      expect(customValidator.getErrorMessages(errors)).toContain(errorMessage1);
    });

    it('should handle multiple errors correctly', () => {
      let validationResult = {'illegal-value-error': true, 'another-illegal-value-error': true};
      customValidator = new CustomValidator(
          (control: AbstractControl) => {
            return validationResult;
          },
          errorMessageMap);

      let validator = customValidator.getValidationFunction();
      let errors = validator(testControl);
      expect(errors).toBe(validationResult);
      expect(customValidator.getErrorMessages(errors).length).toBe(2);
      expect(customValidator.getErrorMessages(errors)).toContain(errorMessage1);
      expect(customValidator.getErrorMessages(errors)).toContain(errorMessage2);
    });

    it('should handle falsey errors correctly', () => {
      let validationResult = {'illegal-value-error': true, 'another-illegal-value-error': false};
      customValidator = new CustomValidator(
          (control: AbstractControl) => {
            return validationResult;
          },
          errorMessageMap);

      let validator = customValidator.getValidationFunction();
      let errors = validator(testControl);
      expect(errors).toBe(validationResult);
      expect(customValidator.getErrorMessages(errors).length).toBe(1);
      expect(customValidator.getErrorMessages(errors)).toContain(errorMessage1);
    });
  });
}
