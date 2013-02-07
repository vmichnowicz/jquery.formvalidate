/**
 * jQuery Form Validate German error message translations (translation by https://github.com/ajannasch)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.fn.formvalidate.options.localization, {
	de: {
		failure: {
			'default': '{0} ist ungültig.',
			betweenNumeric: '{0} muss zwischen {2} und {3} liegen.',
			date: '{0} ist kein gültiges Datum.',
			email: '{1} ist keine gültige Email Adresse.',
			numChars: '{0} muss aus genau {2} Zeichen bestehen.',
			minChars: '{0} muss aus mindestens {2} Zeichen bestehen.',
			maxChars: '{0} kann maximal {2} Zeichen haben.',
			numOptions: 'Bitte genau {2} Optionen auswählen.',
			minOptions: 'Bitte mindestens {2} Optionen auswählen.',
			maxOptions: 'Bitte maximal {2} Optionen auswählen.',
			'int': '{0} ist keine ganze Zahl(Integer)',
			'float': '{0} ist keine gültige Nummer.',
			required: '{0} ist ein Pflichtfeld.',
			requiredIf: '{0} ist ein Pflichtfeld.',
			lessThan: '{0} muss kleiner sein als {2}.',
			greaterThan: '{0} muss größer sein als {2}.'
		},
		success: {
			'default': '{0} ist gut.'
		}
	}
});