import {
    it,
    describe,
    expect,
    beforeEach,
    injectAsync
} from '@angular/core/testing';
import { TextBoxComponent } from './text-box.component';
import { TextBoxOptions, TextBoxType } from './text-box-options.model';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { ControlGroup, Control, AbstractControl } from '@angular/common';
import { CustomValidator } from '../validation/custom-validator';

export function main() {
  'use strict';
  describe('TextBox', () => {
    let textBox: TextBoxComponent;
    let form;

    beforeEach(() => {
      form = new ControlGroup({});
      textBox = new TextBoxComponent();
      textBox.form = form;
    });

    it('should test findValidators', () => {
      textBox.textBoxOptions = new TextBoxOptions({id: '123', maxLength: 2});
      let validators = textBox['findValidators']();
      expect(validators.length).toBe(1);

      textBox.textBoxOptions = new TextBoxOptions({id: '123', maxLength: 4,
        type: TextBoxType.Email});
      validators = textBox['findValidators']();
      expect(validators.length).toBe(2);

      let validatorFunc = function (control: AbstractControl) { /* */ };
      textBox.textBoxOptions = new TextBoxOptions({
        id: '123',
        customValidator: new CustomValidator(validatorFunc, {}),
        pattern: 'xyz'
      });
      validators = textBox['findValidators']();
      expect(validators.length).toBe(2);
    });

    it('should test getCharsRemaining', () => {
      textBox.textBoxOptions = new TextBoxOptions({id: '123', maxLength: 10});
      let test1 = {value: '7 chars'};
      let test2 = {value: '13 characters'};

      textBox.text = test1 as Control;
      let str = textBox.getCharsRemaining();
      expect(str).toBe(3);

      textBox.text = test2 as Control;
      str = textBox.getCharsRemaining();
      expect(str).toBe(-3);
    });

    it('should test onChange Emitter', () => {
      textBox.textBoxOptions = new TextBoxOptions({id: 'test'});
      textBox.text = {value: 'testing'} as Control;
      textBox.onChange.emit = function (event) {
        expect(event.id).toBe('test');
        expect(event.value).toBe('testing');
      };
      textBox.onControlChange();
    });

    it('should test emailValidator', () => {
      let test1 = {value: 'test1'};
      let test2 = {value: 'test2@'};
      let test3 = {value: 'test3@test'};
      let test4 = {value: 'test4@test.com'};
      let test5 = {value: 'test5@.com'};

      let val = textBox.emailValidator(test1);
      expect(val.invalidEmail).toBe(true);

      val = textBox.emailValidator(test2);
      expect(val.invalidEmail).toBe(true);

      val = textBox.emailValidator(test3);
      expect(val).toBeUndefined();

      val = textBox.emailValidator(test4);
      expect(val).toBeUndefined();

      val = textBox.emailValidator(test5);
      expect(val.invalidEmail).toBe(true);
    });

    it('should test required is present',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TextBoxComponent).then((fixture) => {
          let component = fixture.componentInstance;
          component.textBoxOptions =
              new TextBoxOptions({id: 'test', name: 'test', required: true, value: ''});
          component.form = form;

          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.error-message').innerHTML).toMatchPattern(/required/);
        });
    }));

    it('should test maxLength validator',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TextBoxComponent).then((fixture) => {
          let component = fixture.componentInstance;
          component.textBoxOptions = new TextBoxOptions({id: 'test', name: 'test', maxLength: 5});
          component.form = form;

          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.character-limit').innerHTML).toBeDefined();
        });
    }));

    it('should test email validator',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TextBoxComponent).then((fixture) => {
          let component = fixture.componentInstance;
          component.textBoxOptions =
              new TextBoxOptions({id: 'test', name: 'test', type: TextBoxType.Email});
          component.form = form;

          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.error-message').innerHTML).toMatchPattern(/Invalid email/);
        });
    }));

    it('should test custom validator',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TextBoxComponent).then((fixture) => {
          let component = fixture.componentInstance;
          component.textBoxOptions = new TextBoxOptions({
            id: 'test', name: 'test', validateFunction: function () { /* */ }
          });
          component.form = form;

          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.error-message')).toBeDefined();
        });
    }));

    it('should show over-limit shows when beyond maxLength',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TextBoxComponent).then((fixture) => {
          let component = fixture.componentInstance;
          let element = fixture.nativeElement;
          component.textBoxOptions = new TextBoxOptions({
            id: 'test', name: 'test', validateFunction: function () { /* */ }, maxLength: 5
          });
          component.form = form;
          fixture.detectChanges();
          expect(element.querySelector('.character-limit')).not.toHaveCssClass('over-limit');

          component.text._value = '123456';

          fixture.detectChanges();
          expect(element.querySelector('.character-limit')).toHaveCssClass('over-limit');
        });
    }));
  });
}
