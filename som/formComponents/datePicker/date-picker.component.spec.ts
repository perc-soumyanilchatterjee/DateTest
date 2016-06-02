// angular2 imports
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';
import { ControlGroup, Control } from '@angular/common';

import { DatePickerComponent } from './date-picker.component';
import { DatePickerOptions } from './date-picker.options.model';
import { DateFormatter } from 'ng2-bootstrap/components/datepicker/date-formatter';

describe('DatePicker', () => {
  let datepicker: DatePickerComponent;
  let form;
  let date = new Date().toISOString().slice(0, 10).replace('-', '/');
  beforeEach(() => {
    form = new ControlGroup({});
    datepicker = new DatePickerComponent();
    datepicker.form = form;
    datepicker.inputDate = date;
    datepicker.dateFormatter = new DateFormatter();
  });

  it('Should test findValidators', () => {
    datepicker.datePickerOptions = new DatePickerOptions({id: 't1', required: true, label:
     'Input Date', placeholder: 'Enter Date', description: 'Input Date'});
    let validators = datepicker['findValidators']();
    expect(validators.length).toBe(1);
  });

  it('Changed date should be emitted with invalid date as value', () => {
    datepicker.datePickerOptions = new DatePickerOptions({id: 't2', required: true, label:
     'Input Date', placeholder: 'Enter Date', description: 'Input Date'});
    datepicker.valueChange.emit = function (updatedDate) {
      expect(updatedDate.id).toBe('t2');
      expect(updatedDate.value).toBe('Invalid date');
    };
    datepicker.dateChange(date);
  });

  it('Check hidden flag', () => {
    datepicker.openDatePicker();
    datepicker.hiddenFlag = false;
    datepicker.openDatePicker();
    expect(datepicker.hiddenFlag).toBe(false);
  });

  it('Check blurFlag to be true', () => {
    datepicker.setBlurFlag(true);
    expect(datepicker.blurFlag).toBe(true);
  });

  it('Check blurFlag to be false', () => {
    datepicker.setBlurFlag(false);
    expect(datepicker.blurFlag).toBe(false);
  });

  /*it('Check hidden flag to be true', () => {
    datepicker.blurFlag = true;
    let test1 = {value: '05/05/2016'};
    datepicker.text = test1 as Control;
    datepicker.text.valid = false;
    datepicker.checkBlurAndClose();
    expect(datepicker.hiddenFlag).toBe(true);
  });*/

  it('Check hidden to be true on tab', () => {
    datepicker.hiddenFlag = false;
    datepicker.closePickerOnTab({keyCode: 9});
    expect(datepicker.hiddenFlag).toBe(true);
  });

  it('autoSlash should be called and return false with backspace characters for DD or DD/MM', () => {
    datepicker.dateFormat = 'MM-DD-YYYY';
    datepicker.formattedDate = '05';
    let result = datepicker.autoSlash({keyCode: 8});
    expect(result).toBe(false);
  });

  it('autoSlash should be called and return true with 2 characters for DD', () => {
    datepicker.datePickerOptions = new DatePickerOptions({id: 't1', required: true, label:
     'Input Date', placeholder: 'Enter Date', description: 'Input Date'});
    datepicker.dateFormat = 'MM-DD-YYYY';
    datepicker.formattedDate = '05';
    datepicker.ngOnInit();
    let result = datepicker.autoSlash({keyCode: 23});
    expect(result).toBe(true);
  });

  it('autoSlash should be called and return true with 4 characters DD/MM', () => {
    datepicker.datePickerOptions = new DatePickerOptions({id: 't1', required: true, label:
     'Input Date', placeholder: 'Enter Date', description: 'Input Date'});
    datepicker.dateFormat = 'MM-DD-YYYY';
    datepicker.formattedDate = '05/05';
    datepicker.ngOnInit();
    let result = datepicker.autoSlash({keyCode: 23});
    expect(result).toBe(true);
  });
});
