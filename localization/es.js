/**
 * jQuery Form Validate German error message translations (translation by https://github.com/rmondragon)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.fn.formvalidate.options.localization, {
	es: {
		failure: {
			'default': '{0} es invalido.',
			betweenNumeric: '{0} debe estar entre {2} y {3}.',
			date: '{0} debe ser una fecha v&#160;lida.',
			email: '{1} cuenta de correo invalida',
			numChars: '{0} debe ser exactamente {2} caracteres.',
			minChars: '{0} minimo {2} caracteres.',
			maxChars: '{0} cannot be more than {2} characters.',
			numOptions: 'Must select exactly {2} options.',
			minOptions: 'Must select at least {2} options.',
			maxOptions: 'Cannot select more than {2} options.',
			'int': '{0} must be a whole number (integer).',
			'float': '{0} must be a valid number.',
			required: '{0} se requiere.',
			requiredIf: '{0} se requiere.',
			lessThan: '{0} debe ser inferior a {2}.',
			greaterThan: '{0} debe ser más de {2}.'
		},
		success: {
			'default': '{0} esta bien!'
		}
	}
});