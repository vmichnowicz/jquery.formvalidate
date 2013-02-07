/**
 * jQuery Form Validate German error message translations (translation by https://github.com/ajannasch)
 *
 * Include this file *after* the jquery.formvalidate.js in document <head>
 */
jQuery.extend(true, jQuery.fn.formvalidate.options.localization, {
	pirate: {
		failure: {
			'default': '{0} arrgh is invalid bucko.',
			betweenNumeric: '{0} must be between {2} and {3} pieces of eight.',
			date: 'Blimey! {0} arr not a valid date.',
			email: 'Hornswaggler! {1} arrgh not a valid email.',
			numChars: '{0} must be exactly {2} Jolly Rogers.',
			minChars: '{0} must be at least {2} Jolly Rogers.',
			maxChars: '{0} cannot be more than {2} Jolly Rogers.',
			numOptions: 'Ahoy , yee must select exactly {2} options.',
			minOptions: 'Yee must select at least {2} options.',
			maxOptions: 'Yee cannot select more than {2} options.',
			'int': 'Scuttle this input. {0} arr not an integer.',
			'float': 'Son of a Biscuit Eater! {0} arr not a valid number.',
			required: '{0} arr required!',
			requiredIf: '{0} arr required - no prey, no pay.',
			lessThan: '{0} must be less than {2} or yee risk mutiny.',
			greaterThan: '{0} must be greater than {2} me matey.'
		},
		success: {
			'default': 'Yoo Ho Ho, the {0} arr valid!'
		}
	}
});