import { AbstractControl, ValidatorFn } from '@angular/forms';

// Валидатор для проверки отсутствия пробелов
export function noWhitespaceValidator(control: AbstractControl) {
	const isWhitespace = (control.value || '').trim().length === 0;
	return !isWhitespace ? null : { whitespace: true };
}

// Валидатор для проверки, что значение является числом
export function numberValidator(): ValidatorFn {
	return (control: AbstractControl) => {
		const isValidNumber = !isNaN(parseFloat(control.value)) && isFinite(control.value);
		return isValidNumber ? null : { number: true };
	};
}

// Минимальное значение
export function minValue(min: number): ValidatorFn {
	return (control: AbstractControl) => {
		const value = parseFloat(control.value);
		return value >= min ? null : { minValue: true };
	};
}

// Максимальное значение
export function maxValue(max: number): ValidatorFn {
	return (control: AbstractControl) => {
		const value = parseFloat(control.value);
		return value <= max ? null : { maxValue: true };
	};
}
