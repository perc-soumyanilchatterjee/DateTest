export class DatePickerOptions {
  public id: string;
  public label: string;
  public description: string;
  public disabled: boolean;
  public required: boolean;

  constructor(options) {
    this.id = options.id ? options.id : undefined;
    this.label = options.label ? options.label : undefined;
    this.description = options.description ? options.description : undefined;
    this.required = options.required ? options.required : undefined;
    this.disabled = options.disabled ? options.disabled : undefined;
  }
}
