/**
 * jQuery Form Validation Plugin 0.1
 *
 * Source: https://github.com/vmichnowicz/jquery.formvalidate
 * Example: http://www.vmichnowicz.com/examples/formvalidate/index.html
 *
 * Copyright (c) 2011, Victor Michnowicz (http://www.vmichnowicz.com/)
 */
(function($) {
	/**
	 * Super simple JavaScript sprintf method
	 *
	 * It is by no means perfect, however it will work for our error
	 * messages. If string contains something like "{1}" then that text
	 * will be replaced with the second element from our "params" array.
	 *
	 * String: "My name is {0} and I like {1}."
	 * Array: ["Victor", "dinos"]
	 * Return: "My name is Victor and I like dinos."
	 *
	 * @author Victor Michnowicz
	 * @param array		Array of stirngs to replace in target string
	 * @return object	JavaScript string object
	 */
	String.prototype.sprintf = function(params) {
		var string = this;
		$.each(params, function(index, param) {
			string = string.replace('{' + index + '}', param);
		});
		return string;
	}

	/**
	 * Date create from format method
	 *
	 * This method will create a date object based on the date string
	 * and format provided. If an invalid date is provided it will
	 * simply leave the date object alone.
	 *
	 * @param string	Date string such as "2011-11-11"
	 * @param string	Date format such as "YYYYMMDD"
	 * @return object	JavaScript date object
	 */
	Date.prototype.createFromFormat = function(input, format) {
		// Split date string by ".", "," "/", and "-"
		var dateArray = input.split(/[.,\/ -]/);

		// Make sure we have exactly three parts to our date
		if ( dateArray.length === 3 ) {

			// Loop through each date segment
			for ( var dateSegment in dateArray ) {
				// If date segment is not an integer
				if ( dateArray[dateSegment] % 1 != 0 ) {
					return false;
				}
				// If date segment is an integer
				else {
					dateArray[dateSegment] = parseInt( dateArray[dateSegment] );
				}
			}

			// Date variables
			var year, month, day;

			switch (format) {
				// YYYY-MM-DD
				case 'YYYYMMDD':
					year = dateArray[0];
					month = dateArray[1] - 1;
					day = dateArray[2];
					break;
				// DD-MM-YYYY
				case 'DDMMYYYY':
					year = dateArray[2];
					month = dateArray[1] - 1;
					day = dateArray[0];
					break;
				// MM-DD-YYYY
				default:
					year = dateArray[2];
					month = dateArray[0] - 1;
					day = dateArray[1];
					break;
			}

			// Make sure date is greater than 0, month between 0 and 11, and day between 1 and 31
			if (year >= 1 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
				// Create new date object
				var date = new Date();
				date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and miliseconds all to 0
				date.setFullYear(year, month, day); // Set year, month, and day

				/**
				 * Compare year, month, and day of new date object to day, month
				 * and day properties. We do this because we could set a day of
				 * 31 in a month that does not have 31 days. JavaScript would
				 * then silently set the day of the object to 1. We want this to
				 * report as an invalid date.
				 */
				if ( date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ) {
					this.setFullYear(year, month, day); // Set year, month, and day
					this.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and miliseconds all to 0
				}
			}
		}

		return this;
	}

	/**
	 * jQuery form validation plugin
	 *
	 * @param object	Object with user-submitted overrides and validation methods
	 * @return object	Return the jQuery object so we can method chain this bad-boy
	 */
	$.fn.formvalidate = function(options) {

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend(true, {
			// @todo refactor language objects
			languages: {
				en: {
					between_numeric: '{0} must be between {2} and {3}.',
					date: '{0} must be a valid date.'
				},
				de: {
					between_numeric: '{0} must be between {2} and {3}.',
					date: '{0} must be a valid date.'
				}
			},
			language: 'EN', // English error messages by default
			/**
			 * Processing before everything else takes place
			 *
			 * @access public
			 * @param object	jQuery form object
			 * @param string	CSS class added to inputs that did not pass validation
			 * @param string	CSS class added to inputs that did pass validation
			 * @param string	CSS class prefix to designate filter rules
			 * @param string	CSS class prefix to designate validation rules
			 * @param string	CSS validation rule delimiter
			 * @param string	Wrap error messages inside
			 * @return object 
			 */
			preProcess: function(form, cssFailureClass, cssSuccessClass, cssFilterPrefix, cssValidationPrefix, cssParamDelimiter, failureWrapper) {
				// Remove success and failure classes from inputs
				$(form).find(':input.' + cssFailureClass + ', :input.' + cssSuccessClass).removeClass(cssFailureClass + ' ' + cssSuccessClass);

				// Remove all error messages
				$(form).find('.' + cssFailureClass).remove();
			},
			/**
			 * Process the form
			 *
			 * This function will process our form and grab all input data such
			 * as input name, value, and all associated validations.
			 *
			 * @access private
			 * @param object	jQuery object containing our form that we will attempt to process
			 * @return object	Validation object containing form input data
			 */
			_process: function(O) {
				// Inputs object
				O.inputs = {};

				// Validation result (default to null)
				O.result = null;

				// Loop through each input inside this form
				$(O.form).find(':input').each(function(index, element) {

					// Form validation rules will be applied to elements grouped by their name attribute
					var attrName = $(element).attr('name');

					// If element does not have a name attribute
					if ( ! attrName ) { return; }

					// If this does not exist yet create new validation object
					if ( ! (attrName in O.inputs) )  { O.inputs[attrName] = {}; }

					// Class attribute
					var attrClass = $(element).attr('class');

					// If element does not have a class attribute
					if ( ! attrClass ) { return; }

					// All classes of this form input
					var allClasses = attrClass.split(' ');

					// If input value had not yet been created for this input
					if ( ! ('value' in O.inputs[attrName]) )  {
						// Input value
						var value = null;

						// Checkbox
						if ( $(element).attr('type') === 'checkbox' ) {
							value = []; // This will be an array of values
							$(':input[name="' + attrName + '"]:checked').each(function(checkbox_index, checkbox_element) {
								value[checkbox_index] = $(checkbox_element).val();
							});
						}
						// Radio
						else if ( $(element).attr('type') === 'radio' ) {
							// Get checked radio input
							var radio = $(':input[name="' + attrName + '"]:checked');
							// If user checked a radio input
							if (radio.length) {
								value = $(radio).val();
							}
						}
						// All others
						else {
							value = $(element).val() === '' ? null : $(element).val();
						}

						// Set value in object
						O.inputs[attrName].value = value;
					}

					// If title had not yet been created for this input
					if ( ! ('title' in O.inputs[attrName]) ) {
						// Look for the first input that has this same name attribe and a title attribute and grab its title
						var attrTitleFirst = $(':input[name="' + attrName + '"][title!=""]:first').attr('title');

						// If no title attribute is found, use the inputs name attribute
						O.inputs[attrName].title = attrTitleFirst ? attrTitleFirst : attrName;
					}

					// Set success and failure in object
					O.inputs[attrName].success = null;
					O.inputs[attrName].failure = null;

					// Set value in object
					O.inputs[attrName].errors = [];

					// Validations object for this input
					if ( ! ('validations' in O.inputs[attrName]) )  { O.inputs[attrName].validations = {}; }

					// Filters object for this input
					if ( ! ('filters' in O.inputs[attrName]) )  { O.inputs[attrName].filters = {}; }

					// Loop through each class on this form element
					$.each(allClasses, function(classIndex, className) {

						// If this classes has our form validation CSS prefix (this is always be true if we have no CSS filter prefix)
						if ( className.indexOf(settings.cssFilterPrefix) === 0 ) {

							// Form filter class
							var filterClass = '';

							// Params will start out as an empty array
							var params = [];

							// Get position of paramater start location
							var paramStartLocation = className.indexOf(settings.cssParamDelimiter, settings.cssFilterPrefix.length);

							// If we have some paramaters
							if ( paramStartLocation >= 0 ) {
								// Get array of paramaters
								var params = className.substr(paramStartLocation + 1).split( settings.cssParamDelimiter );

								// Get form validation function name
								filterClass = className.substr( settings.cssFilterPrefix.length, paramStartLocation - settings.cssFilterPrefix.length );
							}
							// If we do not have any paramaters
							else {
								// Get form validation function name
								filterClass = className.substr(settings.cssFilterPrefix.length);
							}

							// If this class name is found in our filters add it to our form validation object
							if (filterClass in settings.filters) {
								O.inputs[attrName].filters[ filterClass ] = params;
							}
						}

						// If this classes has our form validation CSS prefix (this is always be true if we have no CSS validation prefix)
						if ( className.indexOf(settings.cssValidationPrefix) === 0 ) {

							// Form validation class
							var validationClass = '';

							// Params will start out as an empty array
							var params = [];

							// Get position of paramater start location
							var paramStartLocation = className.indexOf(settings.cssParamDelimiter, settings.cssValidationPrefix.length);

							// If we have some paramaters
							if ( paramStartLocation >= 0 ) {
								// Get array of paramaters
								var params = className.substr(paramStartLocation + 1).split( settings.cssParamDelimiter );

								// Get form validation function name
								validationClass = className.substr( settings.cssValidationPrefix.length, paramStartLocation - settings.cssValidationPrefix.length );
							}
							// If we do not have any paramaters
							else {
								// Get form validation function name
								validationClass = className.substr(settings.cssValidationPrefix.length);
							}

							// If this class name is found in our validations add it to our form validation object
							if (validationClass in settings.validations) {
								O.inputs[attrName].validations[ validationClass ] = params;
							}
						}

					});
				});

				return O;
			},
			/**
			 * Processing after form validation (be sure to return form
			 * validation object!)
			 * 
			 * @access public
			 * @param object	Form validation object
			 * @return object	Form validation object
			 */
			postProcess: function(O) {
				return O;
			},
			/**
			 * Validate the form!
			 *
			 * @access private
			 * @param object	Form validation object
			 * @return object	Form validation object with a bunch of additional properties
			 */
			_validate: function(O) {
				// So are we good? We will assume yes, for now...
				O.result = true;

				// Loop through each form element
				$.each(O.inputs, function(inputName, inputObj) {
					// If we have some filters
					if (inputObj.filters) {
						// Loop through each filter for this input
						$.each(inputObj.filters, function(filterName, filterParams) {
							// If this filter exists and this inputs value is not null
							if ( filterName in settings.filters && inputObj.value !== null ) {
								inputObj.value = settings.filters[filterName](inputObj.value, filterParams);
							}
						});
					}

					// If we have some validations
					if (inputObj.validations) {
						// Loop through each validation
						$.each(inputObj.validations, function(validationName, validationParams) {
							// If success or failure has yet to be determined
							if (inputObj.failure === null) {
								// If this validation method is defined
								if (validationName in settings.validations) {
									// If the form input is null we will skip validations UNLESS the current validation is checking that this inputs required status has been met
									if (inputObj.value === null && validationName !== 'required' && validationName !== 'required_if') {
										return true; // Skip current validation and continue with $.each()
									}
									// If validation did not pass
									if ( settings.validations[ validationName ].func(inputObj.value, validationParams) !== true ) {
										validationParams.unshift(inputObj.title, inputObj.value); // Add title and value(s) to beginning of array
										var errorMessage = settings.validations[ validationName ].text.sprintf(validationParams);
										O.result = false; // We are no longer good, we found an error!
										inputObj.success = false; // This form input is no longer valid
										inputObj.failure = true; // Epic fail
										inputObj.errors.push(errorMessage); // Add error to errors array
									}
								}
							}
						});
					}

				});

				return O;
			},
			/**
			 * Run after succussful form validation
			 * 
			 * @access public
			 * @param object	jQuery object of form element
			 * @param object	Object containing all form inputs
			 * @param object	Complete form object
			 * @return bool
			 */
			onSuccess: function(form, inputs, O) {
				alert('Great Success!');
				return true;
			},
			/**
			 * Run after form validation failed
			 * 
			 * @access public
			 * @param object	jQuery object of form element
			 * @param object	Object containing all form inputs
			 * @param object	Complete form object
			 * @return void
			 */
			onFailure: function(form, inputs, O) {
				// Loop through each form input form our validation object
				$.each(inputs, function(inputIndex, inputObj) {
					// If this input did not pass validation
					if (inputObj.failure === true) {
						// Add failure class to input(s)
						$(form).find(':input[name="' + inputIndex + '"]').addClass( settings.cssFailureClass );
						// New error message element
						var el = $( settings.failureWrapper ).addClass( settings.cssFailureClass ).text( inputObj.errors[0] );
						$(form).find(':input[name="' + inputIndex + '"]:last').closest('div').append(el);
					}
					else {
						$(form).find(':input[name="' + inputIndex + '"]').addClass( settings.cssSuccessClass );
					}
				});
			},
			cssFailureClass: 'error', // CSS class added to inputs that did not pass validation
			cssSuccessClass: 'success', // CSS class added to inputs that did pass validation
			cssFilterPrefix: '', // CSS class prefix to designate filter rules
			cssValidationPrefix: '', // CSS class prefix to designate validation rules
			cssParamDelimiter: '-', // CSS validation rule delimiter
			failureWrapper: '<span />', // Wrap error messages inside
			filters: {
				trim: function(input, parmas) {
					if (typeof input == 'string') {
						return $.trim(input) === '' ? null : $.trim(input);
					}
					else {
						return input;
					}
				},
				strtoupper: function(input, params) {
					if (typeof input == 'string') {
						return input.toUpperCase();
					}
					else {
						return input;
					}
				},
				strtolower: function(input, params) {
					if (typeof input == 'string') {
						return input.toLowerCase();
					}
					else {
						return input;
					}
				}
			},
			addFilters: {},
			validations: {
				between_numeric: {
					text: '{0} must be between {2} and {3}.',
					func: function(input, params) {
						// Make sure our input is greater than or equal to first paramater and less than or equal to our second paramater
						return ( parseFloat(input) >= parseFloat(params[0]) && parseFloat(input) <= parseFloat(params[1]) ) ? true : false;
					}
				},
				date: {
					text: '{0} must be a valid date.',
					func: function(input, params) {

						var date = new Date();
						var now = new Date( date.getTime() );

						date.createFromFormat(input, params[0]);

						// If our date created from our format is the same as our cloned date it is invalid
						return date.getTime() === now.getTime() ? false : true;
					}
				},
				email: {
					text: '{1} is not a valid email.',
					func: function(input, params) {
						return input.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1 ? false : true;
					}
				},
				length: {
					text: '{0} must be exactly {2} characters.',
					func: function(input, params) {
						return input.length === parseInt(params[0]);
					}
				},
				min_length: {
					text: '{0} must be at least {2} characters.',
					func: function(input, params) {
						return input.length >= parseInt(params[0]);
					}
				},
				max_length: {
					text: '{0} cannot be more than {2} characters.',
					func: function(input, params) {
						return input.length < parseInt(params[0]);
					}
				},
				options: {
					text: 'Must select exactly {2} options.',
					func: function(input, params) {
						if (input instanceof Array) {
							return input.length === parseInt(params[0]) ? true : false;
						}
						else {
							return false;
						}
					}
				},
				min_options: {
					text: 'Must select at least {2} options.',
					func: function(input, params) {
						if (input instanceof Array) {
							return input.length >= parseInt(params[0]) ? true : false;
						}
						else {
							return false;
						}
					}
				},
				max_options: {
					text: 'Cannot select more than {2} options.',
					func: function(input, params) {
						if (input instanceof Array) {
							return input.length > parseInt(params[0]) ? false : true;
						}
						else {
							return false;
						}
					}
				},
				// http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer#answer-3886106
				'int': {
					text: '{0} must be a whole number (integer).',
					func: function(input, params) {
						 return input % 1 == 0;
					}
				},
				'float': {
					text: '{0} must be a valid number.',
					func: function(input, params) {
						return input % 1 !== 0 ? true : false; // @todo this needs work...
					}
				},
				required: {
					text: '{0} is required.',
					func: function(input, params) {
						// If this is an array
						if (input instanceof Array) {
							return input.length > 0 ? true : false;
						}
						// If this is not an array
						else {
							// Make sure input is not an empty string, null, or false
							return input === '' || input === null || input === false ? false : true;
						}
					}
				},
				required_if: {
					text: '{0} is required.',
					func: function(input, params) {
						
						// Dependent element
						var el = $('#' + params[0]);
						
						var dependent = null;
						
						// If dependent element is a checkbox or radio
						if ( $(el).is(':checkbox') || $(el).is(':radio') ) {
							 // If dependent checkbox or radio is checked set value to TRUE, else NULL
							 dependent = $(el).is(':checked') ? true : null;
						}
						else {
							dependent = $.trim( $(el).val() ) === '' ? null : $.trim( $(el).val() );
						}
						return (dependent !== null || dependent === []) && input === null ? false : true;
					}
				},
				less_than: {
					text: '{0} must be less than {2}.',
					func: function(input, params) {
						return parseFloat(input) < parseFloat(params[0]);
					}
				},
				greater_than: {
					text: '{0} must be greater than {2}.',
					func: function(input, params) {
						return parseFloat(input) > parseFloat(params[0]);
					}
				}
			},
			addValidations: {}
		}, options);

		// Loop through each selected element
		return this.each(function() {

			// Main form validation object
			var O = {};

			// Our form
			O.form = this;

			// If selected language is not English
			if (settings.language.toUpperCase() !== 'EN') {
				var language = settings.language.toLowerCase();
				try {
					$.extend(true, settings.validations, window.formvalidate.languages[language].validations);
				}
				catch(exception) {
					throw new Error('Could not load "' + language + '" form validate language object.');
				}
			}

			// Run preProcess function
			settings.preProcess(O.form, settings.cssFailureClass, settings.cssSuccessClass, settings.cssFilterPrefix, settings.cssValidationPrefix, settings.cssParamDelimiter, settings.failureWrapper);

			// Process form an populate our main object
			O = settings._process(O);

			// Validate form get back another object that includes a bunch of new post-data validation info
			O = settings._validate(O);

			// Run postProcess function
			O = settings.postProcess(O);

			// On form validation success
			O.result === true ? settings.onSuccess(O.form, O.inputs, O) : settings.onFailure(O.form, O.inputs, O);
		});
	}
})(jQuery);