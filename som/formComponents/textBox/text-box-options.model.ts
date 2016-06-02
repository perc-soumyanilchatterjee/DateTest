import {CustomValidator} from '../validation/custom-validator';

export class TextBoxOptions {
  public id: string;
  public label: string;
  public type: TextBoxType;
  public disabled: boolean;
  public placeholder: string;
  public value: string;
  public description: string;
  public required: boolean;
  public minLength: number;
  public maxLength: number;
  public pattern: string;
  public customValidator: CustomValidator;

  constructor(options) {
    this.id = options.id ? options.id : undefined;
    this.label = options.label ? options.label : undefined;
    this.type = options.type ? options.type : TextBoxType.Text;
    this.disabled = options.disabled ? options.disabled : false;
    this.placeholder = options.placeholder ? options.placeholder : undefined;
    this.value = options.value ? options.value : '';
    this.description = options.description ? options.description : undefined;
    this.required = options.required ? options.required : undefined;
    this.minLength = options.minLength ? options.minLength : undefined;
    this.maxLength = options.maxLength ? options.maxLength : undefined;
    this.pattern = options.pattern ? options.pattern : undefined;
    this.customValidator = options.customValidator ? options.customValidator : undefined;
  }

  public getType(): string {
    return TextBoxType[this.type];
  }
}

export enum TextBoxType {
  Text,
  Password,
  Email,
}
