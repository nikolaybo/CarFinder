import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({ name: 'formError', standalone: true, pure: false })
export class FormErrorPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): string | null {
    if (!control || !control.invalid || !control.touched) return null;

    if (control.hasError('required'))  return 'This field is required';
    if (control.hasError('email'))     return 'Please enter a valid email address';
    if (control.hasError('minlength')) {
      const { requiredLength } = control.getError('minlength');
      return `Must be at least ${requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const { requiredLength } = control.getError('maxlength');
      return `Must be no more than ${requiredLength} characters`;
    }
    if (control.hasError('pattern'))   return 'Invalid format';

    return 'Invalid value';
  }
}
