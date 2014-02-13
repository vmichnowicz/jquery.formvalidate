/**
 * jQuery Form Validate French error message translations (translation by https://github.com/lpfrenette)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.fn.formvalidate.options.localization, {
	fr: {
		failure: {
			'default': '{0} est invalide.',
			betweenNumeric: '{0} doit être entre {2} et {3}.',
			date: '{0} n\'est pas une date valide.',
			email: '{1} n\'est pas un courriel valide.',
			numChars: '{0} doit être exactement {2}.',
			minChars: '{0} doit être au moins {2}.',
			maxChars: '{0} ne peut être supérieur à {2}.',
			numOptions: 'Ahoy , yee must select exactly {2} options.',
			minOptions: 'Vous devez sélectionner au moins {2} options.',
			maxOptions: 'Vous ne pouvez sélectionner plus de {2} options.',
			'int': '{0} n\'est pas un entier.',
			'float': '{0} n\'est pas un nombre valide.',
			required: '{0} est requis.',
			requiredIf: '{0} est requis.',
			lessThan: '{0} doit être moins de {2}.',
			greaterThan: '{0} doit être suppérieur à {2}.'
		},
		success: {
			'default': '{0} est valide!'
		}
	}
});
