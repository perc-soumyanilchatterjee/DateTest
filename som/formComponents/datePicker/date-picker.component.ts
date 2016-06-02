import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, Validators, Control } from '@angular/common';

import { DATEPICKER_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { DatePickerOptions } from './date-picker.options.model';
import { DateFormatter } from 'ng2-bootstrap/components/datepicker/date-formatter';

@Component({
selector: 'lxk-datepicker',
template: `
  <form [ngFormModel]="form">
     <div class='col-sm-2'>
        <label>{{ datePickerOptions.label }}
          <span *ngIf="datePickerOptions.required"> (Required)</span>
        </label>
        <div id='datePickerDiv' (keyup)="closePickerOnTab($event)" (keydown)="closePickerOnTab($event)" 
        (mouseout)="setBlurFlag(true)" (mousedown)="setBlurFlag(false)">
          <input ngControl="{{ datePickerOptions.id }}"
              [disabled]="datePickerOptions.disabled" [value]="formattedDate" type="text"
              (click)="openDatePicker()" (keyup)="autoSlash($event)"
              (blur)="checkBlurAndClose()" placeholder="{{ dateFormat }}"/>
          <span class="glyphicon glyphicon-calendar" (click)="openDatePickerAndFocus($event)"></span>
          <span>
              <div style ='position:absolute;' [hidden]="hiddenFlag">
                <datepicker
                  [(ngModel)]="inputDate"
                  (ngModelChange)="dateChange($event)"
                  [initDate]="inputDate"
                  [showWeeks]=false
                  [datepickerMode]="datepickerMode">
                </datepicker>
              </div>
          </span>
        </div>
        <span *ngIf="datePickerOptions.required">
            <div style='padding-top:15px;' [hidden]="text.pristine || !text.hasError('required')">
              <p class='error-message'>
                <span class='red-error-icon glyphicon icon-error'>{{ datePickerOptions.label }} is required.</span>
              </p>
            </div>
        </span>
        <span>
          <div style='padding-top:15px;' [hidden]="!(text.dirty && text.hasError('pattern'))">
             <p class="error-message">
                <span class='red-error-icon glyphicon icon-error'>{{ datePickerOptions.label }} is invalid.</span>
              </p>
           </div>
        </span>
        <span style='padding-top:15px;' [ngClass]="{hidden: !datePickerOptions.description}">
          {{ datePickerOptions.description }}
        </span>
      </div>
  </form>
`,

directives: [DATEPICKER_DIRECTIVES, FORM_DIRECTIVES]
})

export class DatePickerComponent implements OnInit {
  @Input() form: ControlGroup;
  @Input() inputDate: any;
  @Input() datePickerOptions: DatePickerOptions;
  @Output() valueChange: EventEmitter<any> =  new EventEmitter();
  private datePickerMode: string;
  /* tslint:disable:max-line-length */
  private patternMap = {
    'MM-DD-YYYY': '^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$'
  };
  /* tslint:enable */
  formattedDate: string;
  hiddenFlag: boolean = true;
  blurFlag: boolean = true;
  dateFormat: string;
  patternFormat: string;
  text: Control;
  dateFormatter: DateFormatter;

  ngOnInit() {
    this.dateFormat = 'MM-DD-YYYY';
    this.datePickerMode = 'day';
    this.dateFormatter = new DateFormatter();
    this.patternFormat = this.findDatePattern(this.dateFormat);
    this.text = new Control(this.formattedDate, Validators.compose(this.findValidators()));
    this.form.addControl(this.datePickerOptions.id, this.text);
  }

  dateChange(date: any) {
    this.inputDate = new Date(date);
    this.hiddenFlag = true;
    this.formatDate(this.inputDate);
    this.valueChange.emit({id: this.datePickerOptions.id, value: this.formattedDate});
  }

  private formatDate(inputDate) {
    let formattedDateArray = this.dateFormatter.format(this.inputDate, this.dateFormat).split('');
    this.formattedDate = this.replaceString(formattedDateArray);
  }

  checkBlurAndClose() {
    if (this.blurFlag) {
      this.hiddenFlag = true;
      if (this.text.valid) {
        this.dateChange(this.text.value);
      }
    }
  }

  setBlurFlag(flag: boolean) {
    this.blurFlag = flag;
  }

  autoSlash(event): boolean {
    let key = event.keyCode || event.charCode;
    /* tslint:disable:no-null-keyword */
    if (key === 8 || key === 46 || this.text.value === null) {
    /* tslint:enable */
      return false;
    } else if (this.dateFormat === 'MM-DD-YYYY') {
        if (this.text.value.length === 2) {
           this.formattedDate = this.text.value.substring(0, 2) + '/' ;
        }  else if (this.text.value.length === 5) {
              this.formattedDate = this.text.value.substring(0, 5) + '/';
        }
    }
    return true;
  }

  closePickerOnTab(event) {
    if (event.keyCode === 9) {
      if (this.text.valid) {
        this.dateChange(this.text.value);
      }
      if (this.hiddenFlag === true) {
        this.hiddenFlag = false;
      } else {
          this.hiddenFlag = true;
      }
    }
  }

  openDatePicker() {
     this.hiddenFlag = false;
  }

  openDatePickerAndFocus(event) {
     this.openDatePicker();
     let datePickerTextId = event.target.parentNode.getElementsByTagName('input')[0];
     datePickerTextId.focus();
  }

  private replaceString(dateArray: any): string {
    let dateArraylength = dateArray.length;
    for (let i = 0; i < dateArraylength; i++) {
      if (dateArray[i] === '-') {
       dateArray[i] = '/';
      }
    }
    return dateArray.join('');
  }

  private findValidators() {
    let validators: any[] = [];
    if (this.datePickerOptions.required) {
      validators.push(Validators.required);
    }
    if (this.patternFormat) {
      validators.push(Validators.pattern(this.patternFormat));
    }
    return validators;
  }

  private findDatePattern(dateformat: string): string {
    let patternArray = Object.keys(this.patternMap);
    let arrayLength = patternArray.length;
    let patternString: string;
    for (let i = 0; i < arrayLength; i++) {
      if (patternArray[i] === dateformat) {
        patternString = this.patternMap[dateformat];
      }
    }
    return patternString;
  }
}
