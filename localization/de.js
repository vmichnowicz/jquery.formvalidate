/**
 * jQuery Form Validate German error message translations (translation by https://github.com/ajannasch)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.fn.formvalidate.options.localization, {
	de: {
		'default': '{0} ist ungültig.',
		between_numeric: '{0} muss zwischen {2} und {3} liegen.',
		date: '{0} ist kein gültiges Datum.',
		email: '{1} ist keine gültige Email Adresse.',
		length: '{0} muss aus genau {2} Zeichen bestehen.',
		min_length: '{0} muss aus mindestens {2} Zeichen bestehen.',
		max_length: '{0} kann maximal {2} Zeichen haben.',
		options: 'Bitte genau {2} Optionen auswählen.',
		min_options: 'Bitte mindestens {2} Optionen auswählen.',
		max_options: 'Bitte maximal {2} Optionen auswählen.',
		'int': '{0} ist keine ganze Zahl(Integer)',
		'float': '{0} ist keine gültige Nummer.',
		required: '{0} ist ein Pflichtfeld.',
		required_if: '{0} ist ein Pflichtfeld.',
		less_than: '{0} muss kleiner sein als {2}.',
		greater_than: '{0} muss größer sein als {2}.'
	}
});