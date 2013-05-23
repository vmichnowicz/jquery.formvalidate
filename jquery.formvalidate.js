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
	 * Find an element and include current element in selection
	 *
	 * @author Jeoff Wilks
	 * @url http://stackoverflow.com/a/3742019
	 * @param {String} selector
	 * @returns {jQuery}
	 */
	$.fn.findAndSelf = function(selector) {
		return this.find(selector).add(this.filter(selector));
	};

	/**
	 * Find an element and include current element in selection
	 *
	 * @author Jeoff Wilks
	 * @url http://stackoverflow.com/a/3742019
	 * @param {String} selector
	 * @returns {jQuery}
	 */
	$.fn.closestAndSelf = function(selector) {
		return this.closest(selector).add(this.filter(selector));
	};

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
	 * @return {String}
	 */
	String.prototype.sprintf = function(params) {
		var string = this;
		$.each(params, function(index, param) {
			string = string.replace('{' + index + '}', param);
		});
		return string;
	};

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
		var dateArray = input.split(/[.,\/ \-]/);

		// Make sure we have exactly three parts to our date
		if ( dateArray.length === 3 ) {

			// Loop through each date segment
			for ( var dateSegment in dateArray ) {
				// If date segment is not an integer
				if ( dateArray[dateSegment] % 1 != 0 ) {
					throw new Error('Invalid date segment provided.');
				}
				// If date segment is an integer
				else {
					dateArray[dateSegment] = parseInt( dateArray[dateSegment] , 10);
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
		else {
			throw new Error('Invalid date provided.');
		}

		// If our date created from our format is the same as our cloned date it is invalid
		if ( this.getTime() === now.getTime() ) {
			throw new Error('Invalid date provided.');
		}

		return this;
	};

	/**
	 * jQuery form validation plugin
	 *
	 * $('form').submit(function(e) {
	 *     e.preventDefault();
	 *     $(this).formvalidate();
	 * });
	 *
	 * @param {Object} options Object with user-submitted overrides and validation methods
	 * @return {jQuery} Return the jQuery object so we can method chain this bad-boy
	 */
	$.fn.formvalidate = function(options) {

		options = $.extend(true, {}, $.fn.formvalidate.options, options );

		return this.each(function () {

			this.options = options;
			this.result = false;
			this.inputs = {};

			// Run function before we do any processing (can be overwritten by user)
			this.options.preProcess.call(this, this, this.options, this.options.inputFailureClass, this.options.inputSuccessClass, this.options.messageFailureClass, this.options.messageSuccessClass, this.options.messageElement, this.options.messageParent);

			// Process form inputs
			this.options._process.call(this, this, this.options);

			// Validate form
			this.options._validate.call(this, this, this.options);

			// Run postProcess function
			this.options.postProcess.call(this, this, this.inputs);

			// Display success and failure messages
			this.options._displayMessages(this, this.inputs);

			// On form validation success
			this.result === true ? this.options.onSuccess(this, this.inputs, this.options) : this.options.onFailure(this, this.inputs, this.options);
		});
	};

	/**
	 * Form validation options
	 *
	 * All of these options can be overwritten by the user. However, it is recommended that the underscored methods
	 * remain private and unmodified. User can overwrite these options by passing a custom object to the form validation
	 * plugin:
	 *
	 * $('form').submit(function(e) {
	 *   e.preventDefault();
	 *     $(this).formvalidate({
     *       failureMessages: true,
     *       successMessages: true
     *   });
     * });
	 *
	 * Or, a user can provide global overrides that will affect all forms. This can be done, for example, by including
	 * a bit of JavaScript after including the jQuery Form Validate plugin.
	 *
	 * jQuery.extend(true, jQuery.fn.formvalidate.options, {
	 *   postProcess: function() { alert('We are done processing!!!'); }
	 * });
	 *
	 * @type {Object}
	 */
	$.fn.formvalidate.options = {
		/**
		 * Processing before everything else takes place
		 *
		 * @param {Object} form jQuery form object
		 * @param {Object} options Form validation options
		 * @param {String} inputFailureClass CSS class added to inputs that did not pass validation
		 * @param {String} inputSuccessClass CSS class added to inputs that did pass validation
		 * @param {String} messageFailureClass CSS class(es) added to message elements signaling failure
		 * @param {String} messageSuccessClass CSS class(es) added to message elements signaling success
		 * @param {String} messageElement HTML element to wrap messages
		 * @return {undefined}
		 */
		preProcess: function(form, options, inputFailureClass, inputSuccessClass, messageFailureClass, messageSuccessClass, messageElement) {
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
		 * This function will process our form and grab all input data such as input name, value, and all associated
		 * validations.
		 *
		 * @param {jQuery} form
		 * @param {Object} options
		 * @return {undefined}
		 */
		_process: function(form, options) {

			// Inputs object
			var inputs = {};

			// Loop through each input inside this form
			$(form).find(':input').each(function(index, element) {

				// Form validation rules will be applied to elements grouped by their name attribute
				var attrName = $(element).attr('name');
				var data = $(element).data(); // Data attributes converted to camelCase by jQuery

				// If element does not have a name attribute
				if ( ! attrName ) { return; }

				// If this does not exist yet create new validation object
				if ( ! (attrName in inputs) )  { inputs[attrName] = {}; }

				// Check CSS class and then data-required attribute
				if ( ! ('required' in inputs[attrName]) || inputs[attrName].required === false )  {
					inputs[attrName].required = $(element).hasClass('required') || 'required' in data;
				}

				// If input value had not yet been created for this input
				if ( ! ('value' in inputs[attrName]) )  {
					// Input value
					var value = null;

					// Checkbox
					if ( $(element).is(':checkbox') ) {
						value = []; // This will be an array of values
						$(':input[name="' + attrName + '"]:checked').each(function(checkboxIndex, checkboxElement) {
							value[checkboxIndex] = $(checkboxElement).val();
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
					var title = null;

					// Check for title data-title attribute
					if ('title' in data) {
						title = data.title;
					}

					// If still no title, use the inputs title attribute
					if ( ! title ) {
						// Look for the first input that has this same name attribe and a title attribute and grab its title
						title = $(':input[name="' + attrName + '"][title!=""]:first').attr('title');
					}

					// If still no title, check associated label
					if ( ! title ) {
						var id = $(':input[name="' + attrName + '"][id!=""]:first').attr('id');
						title = $('label[for="' + id + '"]').text();
					}

					// If still no title, check parent label
					if ( ! title ) {
						title = $('label :input[name="' + attrName + '"]:first').closest('label').text();
					}

					inputs[attrName].title = title;
				}

				// Set success and failure in object
				inputs[attrName].success = null;
				inputs[attrName].failure = null;

				// Set value in object
				inputs[attrName].messages = {
					failure: [],
					success: []
				};

				// Validations object for this input
				if ( ! ('validations' in inputs[attrName]) )  { inputs[attrName].validations = {}; }

				// Filters object for this input
				if ( ! ('filters' in inputs[attrName]) )  { inputs[attrName].filters = {}; }

				$.each(options.validations, function(validation, method) {
					// If this is the required validation
					if (validation === 'required') {
						var required = $(element).hasClass('required') || 'required' in data;
						if (required === true) {
							inputs[attrName].validations.required = [true];
						}
					}
					// If this is the required_if validation
					else if (validation === 'requiredIf') {
						if ('requiredIf' in data) {
							inputs[attrName].validations.requiredIf = [ data.requiredIf ];
						}
					}
					// Default validation, if set by user
					else if (validation in data) {
						inputs[attrName].validations[ validation ] = data[validation].toString().split(' ');
					}
				});

				$.each(options.filters, function(filter, method) {
					if (filter in data) {
						var filterParams = [attrName];
						filterParams.push(typeof param === 'string' ? data[filter].split(' ') : null);
						inputs[attrName].filters[ filter ] = filterParams;
					}
				});
			});

			this.inputs = inputs;
			this.result = null; // Validation result (default to null)

			return this;
		},
		/**
		 * Processing after form validation
		 *
		 * @param {jQuery} form jQuery object of form element
		 * @param {Object} inputs Object containing all form inputs
		 * @return {undefined}
		 */
		postProcess: function(form, inputs) {
			return form;
		},
		/**
		 * Validate the form!
		 *
		 * @param {Object} form Our form
		 * @param {Object} options Form options
		 * @returns {undefined}
		 */
		_validate: function(form, options) {
			// So are we good? We will assume yes, for now...
			var result = true;
			var message = null;

			// Loop through each form element
			$.each(form.inputs, function(inputName, inputObj) {

				// If we have some filters
				if (inputObj.filters) {
					// Loop through each filter for this input
					$.each(inputObj.filters, function(filterName, filterParams) {
						// If this filter exists and this inputs value is not null
						if ( filterName in options.filters && inputObj.value !== null ) {
							inputObj.value = options.filters[filterName](inputObj.value, filterParams);
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
							if (validationName in options.validations) {

								// If the form input is null we will skip validations UNLESS the current validation is checking that this inputs required status has been met
								if (inputObj.value === null && validationName !== 'required' && validationName !== 'requiredIf') {
									return true; // Skip current validation and continue with $.each()
								}

								// If validation did pass
								if ( options.validations[ validationName ](inputObj.value, validationParams) === true ) {

									// Add title and value(s) to beginning of params array
									validationParams.unshift(inputObj.title, inputObj.value);

									// If success message is in localized language object
									if ( inputName in options.localization[ options.language].success ) {
										if ( typeof options.localization[ options.language ].success[ inputName ] === 'function' ) {
											message = options.localization[ options.language ].success[ inputName ](inputObj.title, inputObj.value, inputName, inputObj).sprintf(validationParams);
										}
										else {
											message = options.localization[ options.language ].success[ inputName ].sprintf(validationParams);
										}
									}
									// Else if default localized success message is available
									else if ( 'default' in options.localization[ options.language ].success ) {
										message = options.localization[ options.language ].success.default.sprintf(validationParams);
									}

									inputObj.messages.success.push(message); // Add success message to success messages array
								}
								// If validation did not pass
								else {
									// Add title and value(s) to beginning of params array
									validationParams.unshift(inputObj.title, inputObj.value);

									// If error message is in localized language object
									if ( validationName in options.localization[ options.language ].failure ) {
										if ( typeof options.localization[ options.language ].failure[ validationName ] === 'function' ) {
											message = options.localization[ options.language ].failure[ validationName ](inputObj.title, inputObj.value, inputName, inputObj).sprintf(validationParams);
										}
										else {
											message = options.localization[ options.language ].failure[ validationName ].sprintf(validationParams);
										}
									}
									// Else if default localized error message is available
									else if ( 'default' in options.localization[ options.language ].failure ) {
										message = options.localization[ options.language ].failure[ 'default' ].sprintf(validationParams);
									}

									result = false; // We are no longer good, we found an error!
									inputObj.success = false; // This form input is no longer valid
									inputObj.failure = true; // Epic fail
									inputObj.messages.failure.push(message); // Add failure message to failure messages array
								}
							}
						}
					});

					// If we have gone through all validation for this input with no errors then we can assume success
					inputObj.success = inputObj.success === null ? true : false;
					inputObj.failure = inputObj.failure === null ? false : true;
				}
			});

			this.result = result;
			return this;
		},
		/**
		 * Run after form validation to display success and failure messages
		 *
		 * @param {jQuery} form jQuery form element
		 * @param {Object} inputs All form inputs
		 * @return {undefined}
		 */
		_displayMessages: function(form, inputs) {
			// Only continue if we have any messages to display
			if ( form.options.failureMessages === false && form.options.successMessages === false ) { return false; }

			// Loop through each form input form our validation object
			$.each(inputs, function(inputIndex, inputObj) {
				// If this input did not pass validation
				if (form.options.failureMessages === true && inputObj.failure === true) {
					// Add failure class to input(s)
					$(form).find(':input[name="' + inputIndex + '"]').addClass( form.options.inputFailureClass );
					// New error message element
					var el = $( form.options.messageElement ).addClass( form.options.messageFailureClass ).text( inputObj.messages.failure[0] );
					$(form).find(':input[name="' + inputIndex + '"]:last').closestAndSelf( form.options.messageParent ).append(el);
				}
				else if (form.options.successMessages === true) {
					$(form).find(':input[name="' + inputIndex + '"]').addClass( form.options.inputSuccessClass );

					var el = $( form.options.messageElement ).addClass( form.options.messageSuccessClass ).text( inputObj.messages.success[0] );
					$(form).find(':input[name="' + inputIndex + '"]:last').closestAndSelf( form.options.messageParent ).append(el);
				}
			});
		},
		/**
		 * Run after successful form validation
		 *
		 * @param {jQuery} form jQuery form element
		 * @param {Object} options All form inputs
		 * @return {undefined}
		 */
		onSuccess: function(form, inputs, options) {
			if ('submit' in form) {
				form.submit();
			}
		},
		/**
		 * Run after form validation failed
		 *
		 * @param {jQuery} form jQuery form element
		 * @param {Object} inputs All form inputs
		 * @return {undefined}
		 */
		onFailure: function(form, inputs, options) { },
		messageParent: 'div', // CSS selector of parent element of message (success or failure) messages
		messageElement: '<span />', // Wrap success and failure messages inside this element
		failureMessages: true, // Display failure messages?
		successMessages: false, // Display success messages?
		messageFailureClass: 'error', // CSS class(es) applied to failure messages
		messageSuccessClass: 'success', // CSS class(es) applied to success messages
		inputFailureClass: 'error', // CSS class added to inputs that did not pass validation
		inputSuccessClass: 'success', // CSS class added to inputs that did pass validation
		language: 'en', // English error messages by default
		localization: {
			en: {
				failure: {
					'default': '{0} is invalid.',
					betweenNumeric: '{0} must be between {2} and {3}.',
					date: '{0} must be a valid date.',
					email: '{1} is not a valid email.',
					numChars: '{0} must be exactly {2} characters.',
					minChars: '{0} must be at least {2} characters.',
					maxChars: '{0} cannot be more than {2} characters.',
					numOptions: 'Must select exactly {2} options.',
					minOptions: 'Must select at least {2} options.',
					maxOptions: 'Cannot select more than {2} options.',
					'int': '{0} must be a whole number (integer).',
					'float': '{0} must be a valid number.',
					required: '{0} is required.',
					requiredIf: '{0} is required.',
					lessThan: '{0} must be less than {2}.',
					greaterThan: '{0} must be greater than {2}.'
				},
				success: {
					'default': '{0} is valid'
				}
			}
		},
		filters: {
			/**
			 * Trim whitespace
			 *
			 * @param {String} input
			 * @param {Array} params
			 * @return {String}
			 */
			trim: function(input, params) {
				if (typeof input === 'string') {
					return $.trim(input) === '' ? null : $.trim(input);
				}
				else {
					return input;
				}
			},
			strtoupper: function(input, params) {
				if (typeof input === 'string') {
					return input.toUpperCase();
				}
				else {
					return input;
				}
			},
			strtolower: function(input, params) {
				if (typeof input === 'string') {
					return input.toLowerCase();
				}
				else {
					return input;
				}
			}
		},
		validations: {
			betweenNumeric: function(input, params) {
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
			dateAfter: function(input, params) {

			},
			dateBefore: function(input, params) {

			},
			email: function(input, params) {
				return input.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1 ? false : true;
			},
			numChars: function(input, params) {
				return input.length === parseInt(params[0], 10);
			},
			minChars: function(input, params) {
				return input.length >= parseInt(params[0], 10);
			},
			maxChars: function(input, params) {
				return input.length < parseInt(params[0], 10);
			},
			numOptions: function(input, params) {
				if (input instanceof Array) {
					return input.length === parseInt(params[0], 10) ? true : false;
				}
				else {
					return false;
				}
			},
			minOptions: function(input, params) {
				if (input instanceof Array) {
					return input.length >= parseInt(params[0], 10) ? true : false;
				}
				else {
					return false;
				}
			},
			maxOptions: function(input, params) {
				if (input instanceof Array) {
					return input.length > parseInt(params[0], 10) ? false : true;
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
			requiredIf: function(input, params) {
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
			lessThan: function(input, params) {
				return parseFloat(input) < parseFloat(params[0]);
			},
			greaterThan: function(input, params) {
				return parseFloat(input) > parseFloat(params[0]);
			}
		}
	};

})(jQuery);