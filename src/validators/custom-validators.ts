import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl) {
	const isWhitespace = typeof control.value === 'string' && control.value.trim().length === 0;
	return !isWhitespace ? null : { noWhitespace: true };
}

export function numberValidator(): ValidatorFn {
	return (control: AbstractControl) => {
		const isValidNumber = !isNaN(parseFloat(control.value)) && isFinite(control.value);
		return isValidNumber ? null : { notANumber: true };
	};
}

export function minValue(min: number): ValidatorFn {
	return (control: AbstractControl) => {
		const value = parseFloat(control.value);
		return value >= min ? null : { min: true };
	};
}

export function maxValue(max: number): ValidatorFn {
	return (control: AbstractControl) => {
		const value = parseFloat(control.value);
		return value <= max ? null : { max: true };
	};
}
