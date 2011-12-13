/*
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
			switch (format) {
				// YYYY-MM-DD
				case 'YYYYMMDD':
					var year = parseInt( dateArray[0] );
					var month = parseInt( dateArray[1] ) - 1;
					var day = parseInt( dateArray[2] );
					break;
				// DD-MM-YYYY
				case 'DDMMYYYY':
					var year = parseInt( dateArray[2] );
					var month = parseInt( dateArray[1] ) - 1;
					var day = parseInt( dateArray[0] );
					break;
				// MM-DD-YYYY
				default:
					var year = parseInt( dateArray[2] );
					var month = parseInt( dateArray[0] ) - 1;
					var day = parseInt( dateArray[1] );
					break;
			}

			// Make sure date is greater than 0, month between 0 and 11, and day between 1 and 31
			if (year >= 1 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
				// Create new date object
				var date = new Date();
				date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and miliseconds all to 0
				date.setFullYear(year, month, day); // Set year, month, and day

				/**
				 * Compare year, month, and day of new date object to
				 * day, month and day properties. We do this because we
				 * could set a day of 31 in a month that does not have
				 * 31 days. JavaScript would then silently set the day
				 * of the object to 1. We want this to report as an
				 * invalid date.
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
			validateOnEvent: 'submit', // Events such as "click", "hover", "focus", etc...
			validateOnObject: null, // jQuery object that we will attach our event listiner to
			// Processing before everything else takes place
			preProcess: function() {
				// Remove failure class from inputs
				$(':input.' + settings.cssFailureClass).removeClass(settings.cssFailureClass);

				// Remove all error messages
				$('.' + settings.cssFailureClass).remove();
			},
			// Processing after form validation (be sure to return form validation object!)
			postProcess: function(O) {
				return O;
			},
			// Validation succussful
			onSuccess: function(O) {
				alert('Great Success!');
				return true;
			},
			// Validation failed
			onFailure: function(O) {
				// Loop through each form input form our validation object
				$.each(O.inputs, function(inputIndex, inputObj) {
					// If this input did not pass validation
					if (inputObj.failure === true) {
						// Add failure class to input(s)
						$(':input[name="' + inputIndex + '"]').addClass( settings.cssFailureClass );
						// New error message element
						var el = $( settings.failureWrapper ).addClass( settings.cssFailureClass ).text( inputObj.errors[0] );
						$(':input[name="' + inputIndex + '"]:last').closest('div').append(el);
					}
				});
			},
			cssFailureClass: 'fv_error', // CSS class added to inputs that did not pass validation
			cssSuccessClass: 'fv_success', // CSS class added to inputs that did pass validation
			cssFilterPrefix: 'ff_', // CSS class prefix to designate filter rules
			cssValidationPrefix: 'fv_', // CSS class prefix to designate validation rules
			cssParamDelimiter: '-', // CSS validation rule delimiter
			failureWrapper: '<span />',
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
				between_numeric: {
					text: '{0} must be between {2} and {3}.',
					func: function(input, params) {
						// Make sure our input is greater than or equal to first paramater and less than or equal to our second paramater
						return ( parseFloat(input) >= parseFloat(params[0]) && parseFloat(input) <= parseFloat(params[1]) ) ? true : false;
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
				min_options: {
					text: 'Must select at least {2} options.',
					func: function(input, params) {
						if (input instanceof Array) {
							return input.length >= params[0] ? true : false;
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
							return input.length > params[0] ? false : true;
						}
						else {
							return false;
						}
					}
				},
				email: {
					text: '{1} is not a valid email.',
					func: function(input, params) {
						return input.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1 ? false : true;
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
				}
			}
		}, options);

		/**
		 * Validate form!
		 *
		 * @param object	Form validation object
		 * @return object	Form validation object with a bunch of additional properties
		 */
		var validate = function(O) {

			// So are we good? We will assume yes, for now...
			O.result = true;
console.log( O );
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
				
				console.log( O );
				
				// If we have some validations
				if (inputObj.validations) {
					// Loop through each validation
					$.each(inputObj.validations, function(validationName, validationParams) {
						// If success or failure has yet to be determined
						if (inputObj.failure === null) {
							// If this validation method is defined
							if (validationName in settings.validations) {
								// If the form input is null we will skip validations UNLESS the current falidation is checking that this inputs required status has been met
								if (inputObj.value === null && validationName !== 'required') {
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
							// If this validation method is not defined
							else {
								throw new Error('Validation method "' + validationName + '" is not defined.');
							}
						}
					});
				}

			});

			return O;
		}

		/**
		 * Process the form
		 *
		 * This function will process our form and grab all input data
		 * such as input name, value, and all associated validations.
		 *
		 * @param object	jQuery object containing our form that we will attempt to process
		 * @return object	Validation object containing form input data
		 */
		var process = function(form) {

			// Form validation super-awesome-object (SAO)
			var O = {};

			// Inputs object
			O.inputs = {};

			// Validation result (default to null)
			O.result = null;

			// Loop through each input inside this form
			$(form).find(':input').each(function(index, element) {

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

				// If input vale had not yet been created for this input
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
					
					// If this classes has our form validation CSS prefix
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

						O.inputs[attrName].filters[ filterClass ] = params;
					}

					// If this classes has our form validation CSS prefix
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

						O.inputs[attrName].validations[ validationClass ] = params;
					}


				});
			});

			return O;
		}

		// Loop through each selected element
		return this.each(function() {

			// Our form
			var form = this;

			// By defaiult we will run validation on the submission of the form, the user can change this, however
			var validateOnObject = settings.validateOnObject !== null ? settings.validateOnObject : form;

			// Attach event handler to object
			validateOnObject.live(settings.validateOnEvent, function(e) {

				// Main form validation object
				var O = {};

				/**
				 * Run preProcess function
				 * @todo pass the form validatoin object to our preprocessor and then merge the object in our process function
				 */
				settings.preProcess();

				// Process form an populate our main object
				O = process(form);

				// Validate form get back another object that includes a bunch of new post-data validation info
				O = validate(O);

				// Run postProcess function
				O = settings.postProcess(O);

				// On form validation success
				if (O.result === true) {
					// Run success method and pass form validation object along for the ride
					settings.onSuccess(O);
					return true;
				}
				// On form validation error
				else {
					// Run failure method and pass form validation object along for the ride
					settings.onFailure(O);
					e.preventDefault();
				}
			});

		});
	}
})(jQuery);