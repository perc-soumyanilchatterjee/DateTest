// angular2 imports
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { TextBoxOptions, TextBoxType } from './text-box-options.model';
import { FORM_DIRECTIVES, ControlGroup, Validators, Control } from '@angular/common';

@Component({
  selector: 'lxk-text-box',
  template: `
    <form [ngFormModel]="form">
      <div class="form-group">
        <label>{{textBoxOptions.label}}</label>
        <input ngControl="{{textBoxOptions.id}}" type="{{textBoxOptions.getType()}}"
          (change)="onControlChange($event)" class="form-control"
          placeholder="{{textBoxOptions.placeholder}}" [disabled]="textBoxOptions.disabled"
          [ngClass]="{'has-error': text.dirty && text.errors}">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
            <span *ngIf='textBoxOptions.required'>
              <div [hidden]="text.pristine || !text.hasError('required')">
                <p class="error-message">
                   <span class="red-error-icon glyphicon icon-error"></span>
                   {{textBoxOptions.label}} is required
                </p>
              </div>
            </span>
            <span *ngIf='textBoxOptions.minLength'>
               <div [hidden]="!(text.dirty && text.hasError('minlength'))">
                 <p class="error-message">
                    <span class="red-error-icon glyphicon icon-error"></span>
                    Minimum of {{textBoxOptions.minLength}} characters required
                  </p>
               </div>
             </span>
            <span *ngIf='textBoxOptions.getType() == "Email"'>
              <div [hidden]="!(text.dirty && text.hasError('invalidEmail'))">
                <p class="error-message">
                   <span class="red-error-icon glyphicon icon-error"></span>Invalid email address
                 </p>
              </div>
            </span>
            <span *ngIf='textBoxOptions.customValidator'>
              <div *ngFor="let errorMessage of getCustomValidatorErrorMessages()">
                <p class="error-message">
                   <span class="red-error-icon glyphicon icon-error"></span>{{errorMessage}}
                 </p>
              </div>
            </span>
            <span class="help-block" [ngClass]="{hidden: !textBoxOptions.description}">
              {{textBoxOptions.description}}
            </span>
          </div>
          <div *ngIf="textBoxOptions.maxLength" class="row character-limit col-xs-3 col-xs-offset-9
            col-sm-3 col-sm-offset-9 col-md-2 col-md-offset-10 col-lg-2 col-lg-offset-10"
            [ngClass]="{'over-limit': text.value.length > textBoxOptions.maxLength }">
            {{getCharsRemaining()}}
          </div>
        </div>
      </div>
    </form>
    `,
  directives: [FORM_DIRECTIVES]
})

export class TextBoxComponent implements OnInit {
  @Input() form: ControlGroup;
  @Output() onChange = new EventEmitter();
  text: Control;
  @Input() textBoxOptions: TextBoxOptions;

  ngOnInit() {
    this.text = new Control(this.textBoxOptions.value, Validators.compose(this.findValidators()));
    this.form.addControl(this.textBoxOptions.id, this.text);
  }

  private findValidators() {
    let validators: any[] = [];
    if (this.textBoxOptions.required) {
      validators.push(Validators.required);
    }
    if (this.textBoxOptions.minLength) {
      validators.push(Validators.minLength(this.textBoxOptions.minLength));
    }
    if (this.textBoxOptions.maxLength) {
      validators.push(Validators.maxLength(this.textBoxOptions.maxLength));
    }
    if (this.textBoxOptions.pattern) {
      validators.push(Validators.pattern(this.textBoxOptions.pattern));
    }
    if (this.textBoxOptions.type === TextBoxType.Email) {
      validators.push(this.emailValidator);
    }
    if (this.textBoxOptions.customValidator) {
      validators.push(this.textBoxOptions.customValidator.getValidationFunction());
    }
    return validators;
  }

  getCharsRemaining() {
    let currentLength = this.text.value.length;
    let maxLength = this.textBoxOptions.maxLength;
    let length = currentLength ? maxLength - currentLength : maxLength;
    return length;
  }

  getCustomValidatorErrorMessages() {
    if (!this.textBoxOptions.customValidator) {
      return undefined;
    }

    return this.textBoxOptions.customValidator.getErrorMessages(this.text.errors);
  }

  emailValidator(control) {
    /* tslint:disable:max-line-length */
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    /* tslint:enable */

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  onControlChange() {
    this.onChange.emit({id: this.textBoxOptions.id, value: this.text.value});
  }
}
