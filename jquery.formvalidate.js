/**
 * jQuery Form Validation Plugin 0.1.1
 *
 * Source: https://github.com/vmichnowicz/jquery.formvalidate
 * Example: http://www.vmichnowicz.com/examples/formvalidate/index.html
 *
 * Copyright (c) 2011 - 2013, Victor Michnowicz (http://www.vmichnowicz.com/)
 */
(function($) {

	/**
	 * Create fake console object if not defined
	 * 
	 * @author Joseph Silber
	 * @url http://stackoverflow.com/a/7585409
	 */
	if ( ! window.console ) {
		(function() {
			var names = ["log", "debug", "info", "warn", "error", "assert",
			"dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count",
			"trace", "profile", "profileEnd"], i, l = names.length;

			window.console = {};

			for ( i = 0; i < l; i++ ) {
				window.console[ names[i] ] = function() {};
			}
		}());
	}

	/**
	 * Find an element and include current element in selection
	 *
	 * @author Jeoff Wilks
	 * @url http://stackoverflow.com/a/3742019
	 */
	$.fn.findAndSelf = function(selector) {
		return this.find(selector).add(this.filter(selector))
	}
	
	/**
	 * Find an element and include current element in selection
	 *
	 * @author Jeoff Wilks
	 * @url http://stackoverflow.com/a/3742019
	 */
	$.fn.closestAndSelf = function(selector) {
		return this.closest(selector).add(this.filter(selector))
	}

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
	 * @param {Array} params Array of strings to replace in target string
	 * @return {String} JavaScript string object
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
	 * throw an exception.
	 *
	 * @param {String} input Date string such as "2011-11-11"
	 * @param {String} format Date format such as "YYYY-MM-DD"
	 * @returns {Date} JavaScript date object
	 * @throws {Error}
	 */
	Date.prototype.createFromFormat = function(input, format) {

		// Create a new date object representing the date & time for right now
		var now = new Date();

		// Split date string by ".", "," "/", and "-"
		var dateArray = input.split(/[.,\/ -]/);

		// Make sure we have exactly three parts to our date
		if ( dateArray.length === 3 ) {

			// Loop through each date segment
			for ( var dateSegment in dateArray ) {
				// If date segment is not an integer
				if ( dateArray[dateSegment] % 1 != 0 ) {
					throw new Error('Invalid date segment provided.');
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
				case 'YYYY-MM-DD':
					year = dateArray[0];
					month = dateArray[1] - 1;
					day = dateArray[2];
					break;
				// DD-MM-YYYY
				case 'DD-MM-YYYY':
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
				// Create new date object as a clone from our "now" date object
				var date = new Date( now.getTime() );
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

		// If our date created from our format is the same as our cloned date it is invalid
		if ( this.getTime() === now.getTime() ) {
			throw new Error('Invalid date provided.');
		}

		return this;
	}

	// Form validate object
	$.formvalidate = {
		localization: {
			en: {
				'default': '{0} is invalid.',
				between_numeric: '{0} must be between {2} and {3}.',
				date: '{0} must be a valid date.',
				email: '{1} is not a valid email.',
				num_chars: '{0} must be exactly {2} characters.',
				min_chars: '{0} must be at least {2} characters.',
				max_chars: '{0} cannot be more than {2} characters.',
				num_options: 'Must select exactly {2} options.',
				min_options: 'Must select at least {2} options.',
				max_options: 'Cannot select more than {2} options.',
				'int': '{0} must be a whole number (integer).',
				'float': '{0} must be a valid number.',
				required: '{0} is required.',
				required_if: '{0} is required.',
				less_than: '{0} must be less than {2}.',
				greater_than: '{0} must be greater than {2}.'
			}
		},
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
		validations: {
			between_numeric: function(input, params) {
				// Make sure our input is greater than or equal to first paramater and less than or equal to our second paramater
				return ( parseFloat(input) >= parseFloat(params[0]) && parseFloat(input) <= parseFloat(params[1]) ) ? true : false;
			},
			date: function(input, params) {
				// Attempt to create a new date object from provided input & format
				try {
					var date = new Date();
					date.createFromFormat(input, params[0]);
					return true;
				}
				// Return false if any errors are thrown
				catch(e) {
					return false;
				}
			},
			date_after: function(input, params) {
				
			},
			date_before: function(input, params) {
				
			},
			email: function(input, params) {
				return input.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1 ? false : true;
			},
			num_chars: function(input, params) {
				return input.length === parseInt(params[0]);
			},
			min_chars: function(input, params) {
				return input.length >= parseInt(params[0]);
			},
			max_chars: function(input, params) {
				return input.length < parseInt(params[0]);
			},
			num_options: function(input, params) {
				if (input instanceof Array) {
					return input.length === parseInt(params[0]) ? true : false;
				}
				else {
					return false;
				}
			},
			min_options: function(input, params) {
				if (input instanceof Array) {
					return input.length >= parseInt(params[0]) ? true : false;
				}
				else {
					return false;
				}
			},
			max_options: function(input, params) {
				if (input instanceof Array) {
					return input.length > parseInt(params[0]) ? false : true;
				}
				else {
					return false;
				}
			},
			// http://stackoverflow.com/a/3886106/1525008
			'int': function(input, params) {
				return input % 1 == 0;
			},
			// http://stackoverflow.com/a/9327165/1525008
			'float': function(input, params) {
				return !isNaN(parseFloat(input)) && isFinite(input);
			},
			required: function(input, params) {
				// If this is an array
				if (input instanceof Array) {
					return input.length > 0 ? true : false;
				}
				// If this is not an array
				else {
					// Make sure input is not an empty string, null, or false
					return input === '' || input === null || input === false ? false : true;
				}
			},
			required_if: function(input, params) {
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
			},
			less_than: function(input, params) {
				return parseFloat(input) < parseFloat(params[0]);
			},
			greater_than: function(input, params) {
				return parseFloat(input) > parseFloat(params[0]);
			}
		}
	};

	/**
	 * jQuery form validation plugin
	 *
	 * $('form').submit(function(e) {
	 *     e.preventDefault();
	 *     $(this).formvalidate();
	 * });
	 *
	 * @param object	Object with user-submitted overrides and validation methods
	 * @return object	Return the jQuery object so we can method chain this bad-boy
	 */
	$.fn.formvalidate = function(options) {

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend(true, {
			language: 'en', // English error messages by default
			/**
			 * Processing before everything else takes place
			 *
			 * @param {Object} form jQuery form object
			 * @param {String} inputFailureClass CSS class added to inputs that did not pass validation
			 * @param {String} inputSuccessClass CSS class added to inputs that did pass validation
			 * @param {String} messageFailureClass CSS class(es) added to message elements signaling failure
			 * @param {String} messageSuccessClass CSS class(es) added to message elements signaling success
			 * @param {String} messageElement HTML element to wrap messages
			 * @return {undefined}
			 */
			preProcess: function(form, inputFailureClass, inputSuccessClass, messageFailureClass, messageSuccessClass, messageElement) {
				var inputFailureClassString = inputFailureClass.replace(' ', '.');
				var inputSuccessClassString = inputSuccessClass.replace(' ', '.');

				// Remove success and failure classes from inputs
				$(form).find(':input.' + inputFailureClassString + ', :input.' + inputSuccessClassString).removeClass(inputFailureClass + ' ' + inputSuccessClass);

				var messageFailureClassString = messageFailureClass.replace(' ', '.');
				var messageSuccessClassString = messageSuccessClass.replace(' ', '.');

				// Remove all success and failure message elements
				$(form).find('.' + messageFailureClassString + ', .' + messageSuccessClassString).remove();
			},
			/**
			 * Process the form
			 *
			 * This function will process our form and grab all input data such
			 * as input name, value, and all associated validations.
			 *
			 * @return {undefined}
			 */
			_process: function() {

				var form = this;

				// Inputs object
				var inputs = {};

				// Loop through each input inside this form
				$(form).find(':input').each(function(index, element) {

					// Form validation rules will be applied to elements grouped by their name attribute
					var attrName = $(element).attr('name');

					// If element does not have a name attribute
					if ( ! attrName ) { return; }

					// If this does not exist yet create new validation object
					if ( ! (attrName in inputs) )  { inputs[attrName] = {}; }

					// Check CSS class and then data-required attribute
					if ( ! ('required' in inputs[attrName]) || inputs[attrName].required === false )  {
						inputs[attrName].required = $(element).hasClass('required') || typeof $(element).data('required') === 'string';
					}

					// If input value had not yet been created for this input
					if ( ! ('value' in inputs[attrName]) )  {
						// Input value
						var value = null;

						// Checkbox
						if ( $(element).is(':checkbox') ) {
							value = []; // This will be an array of values
							$(':input[name="' + attrName + '"]:checked').each(function(checkbox_index, checkbox_element) {
								value[checkbox_index] = $(checkbox_element).val();
							});
						}
						// Radio
						else if ( $(element).is(':radio') ) {
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
						inputs[attrName].value = value;
					}

					// If title had not yet been created for this input
					if ( ! ('title' in inputs[attrName]) ) {
						// Check for title data-title attribute
						if ( $(element).data('title') ) {
							inputs[attrName].title = $(element).data('title');
						}
						// If no title data-title attribute is found, use the inputs name attribute
						else {
							// Look for the first input that has this same name attribe and a title attribute and grab its title
							inputs[attrName].title = $(':input[name="' + attrName + '"][title!=""]:first').attr('title');
						}
					}

					// Set success and failure in object
					inputs[attrName].success = null;
					inputs[attrName].failure = null;

					// Set value in object
					inputs[attrName].errors = [];

					// Validations object for this input
					if ( ! ('validations' in inputs[attrName]) )  { inputs[attrName].validations = {}; }

					// Filters object for this input
					if ( ! ('filters' in inputs[attrName]) )  { inputs[attrName].filters = {}; }

					$.each(settings.validations, function(validation, method) {
						var params = $(element).data( validation.replace('_', '-') );
						// If this is the required validation
						if (validation === 'required') {
							var required = $(element).hasClass('required') || typeof $(element).data('required') === 'string';
							if (required === true) {
								inputs[attrName].validations.required = [true];
							}
						}
						// If this is the required_if validation
						else if (validation === 'required_if') {
							var required_if = $(element).data('required-if');
							if (typeof required_if !== 'undefined') {
								inputs[attrName].validations.required_if = [required_if];
							}
						}
						// Default validation, if set by user
						else if (typeof params !== 'undefined') {
							inputs[attrName].validations[ validation ] = params.toString().split(' ');
						}
					});

					$.each(settings.filters, function(filter, method) {
						var prefixed = filter.replace('_', '-');
						var params = $(element).data(prefixed);
						if (typeof params !== 'undefined') {

							// Params will start out as an empty array
							var filterParams = [attrName];

							filterParams.push(typeof param === 'string' ? params.split(' ') : null);

							inputs[attrName].filters[ filter ] = filterParams;
						}
					});
				});

				this.inputs = inputs;
				this.result = null; // Validation result (default to null)

				return this;
			},
			/**
			 * Processing after form validation (be sure to return form
			 * validation object!)
			 * 
			 * @access public
			 * @param object	jQuery object of form element
			 * @param object	Object containing all form inputs
			 * @param object	Complete form object
			 * @return object	Form validation object
			 */
			postProcess: function(form, inputs, O) {
				return form;
			},
			/**
			 * Validate the form!
			 *
			 * @access private
			 * @param object	Form validation object
			 * @return object	Form validation object with a bunch of additional properties
			 */
			_validate: function() {
				// So are we good? We will assume yes, for now...
				var result = true;
				var form = this;
				// Loop through each form element
				$.each(form.inputs, function(inputName, inputObj) {

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
									if ( settings.validations[ validationName ](inputObj.value, validationParams) !== true ) {
										validationParams.unshift(inputObj.title, inputObj.value); // Add title and value(s) to beginning of array

										var errorMessage = null;

										// If error message is in localized language object
										if ( validationName in settings.localization[ settings.language ] ) {
											errorMessage = settings.localization[ settings.language ][ validationName ].sprintf(validationParams);
										}
										// Else if default localized error message is available
										else if ( 'default' in settings.localization[ settings.language ] ) {
											errorMessage = settings.localization[ settings.language ][ 'default' ].sprintf(validationParams);
										}
										// Else throw an error
										else {
											throw new Error('No error message available for validation method "' + validationName + '" with language "' + settings.language + '".');
										}

										//var errorMessage = settings.validations[ validationName ].text.sprintf(validationParams);
										result = false; // We are no longer good, we found an error!
										inputObj.success = false; // This form input is no longer valid
										inputObj.failure = true; // Epic fail
										inputObj.errors.push(errorMessage); // Add error to errors array
									}
								}
							}
						});
					}

				});

				this.result = result;

				return this;
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
				form.submit();
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
			onFailure: function(form, inputs) {
				// Loop through each form input form our validation object
				$.each(inputs, function(inputIndex, inputObj) {
					// If this input did not pass validation
					if (inputObj.failure === true) {
						// Add failure class to input(s)
						$(form).find(':input[name="' + inputIndex + '"]').addClass( settings.inputFailureClass );
						// New error message element
						var el = $( settings.messageElement ).addClass( settings.messageFailureClass ).text( inputObj.errors[0] );
						$(form).find(':input[name="' + inputIndex + '"]:last').closestAndSelf( settings.messageParent ).append(el);
					}
					else {
						$(form).find(':input[name="' + inputIndex + '"]').addClass( settings.inputSuccessClass );
						var text = 'Valid'; // Look for success message in localization object
						var el = $( settings.messageElement ).addClass( settings.messageSuccessClass ).text( text );
						$(form).find(':input[name="' + inputIndex + '"]:last').closestAndSelf( settings.messageParent ).append(el);
					}
				});
			},
			messageParent: 'div', // CSS selector of parent element of message (success or failure) messages
			messageElement: '<span />', // Wrap error (maybe even success?) messages inside
			messageFailureClass: 'error',
			messageSuccessClass: 'success',
			inputFailureClass: 'error',
			inputSuccessClass: 'success',
			inputFailureClass: 'error', // CSS class added to inputs that did not pass validation
			inputSuccessClass: 'success', // CSS class added to inputs that did pass validation
			cssParamDelimiter: '-', // CSS validation rule delimiter
			filters: {}, // Merged in from $.formvalidate later
			validations: {} // Merged in from $.formvalidate later
		}, options);

		// Merge everything into settings object
		$.extend(true, settings, $.formvalidate);

		// Loop through each selected element
		return this.each(function() {
			this.settings = settings;

			// If a language code was provided make sure its lowercase, if no language code provided default to "en"
			this.settings.language = this.settings.language ? this.settings.language.toLowerCase() : 'en';

			// Run function before we do any processing (can be overwritten by user)
			this.settings.preProcess.call(this, this, this.settings.inputFailureClass, this.settings.inputSuccessClass, this.settings.messageFailureClass, this.settings.messageSuccessClass, this.settings.messageElement, this.settings.messageParent);

			// Process form inputs
			this.settings._process.call(this);

			// Validate form
			this.settings._validate.call(this);

			// Run postProcess function
			this.settings.postProcess.call(this, this, this.inputs);

			// On form validation success
			this.result === true ? this.settings.onSuccess(this, this.inputs) : this.settings.onFailure(this, this.inputs);
		});
	}

})(jQuery);