/**
 * jQuery Form Validate German error message translations (translation by https://github.com/ajannasch)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.formvalidate, {
	localization: {
		es: {
			'default': '{0} es invalido.',
			between_numeric: '{0} debe estar entre {2} y {3}.',
			date: '{0} debe ser una fecha v&#160;lida.',
			email: '{1} cuenta de correo invalida',
			length: '{0} debe ser exactamente {2} caracteres.',
			min_length: '{0} minimo {2} caracteres.',
			max_length: '{0} cannot be more than {2} characters.',
			options: 'Must select exactly {2} options.',
			min_options: 'Must select at least {2} options.',
			max_options: 'Cannot select more than {2} options.',
			'int': '{0} must be a whole number (integer).',
			'float': '{0} must be a valid number.',
			required: '{0} is required.',
			required_if: '{0} is required.',
			less_than: '{0} must be less than {2}.',
			greater_than: '{0} must be greater than {2}.'
		}
	}
});