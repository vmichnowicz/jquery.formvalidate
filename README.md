# jQuery Form Validate

## License

jQuery Form Validate is licensed under the [MIT](http://opensource.org/licenses/MIT) license.

## Demo / Example

Access a [live demo](http://www.vmichnowicz.com/examples/formvalidate/index.html).

## Introduction

jQuery Form Validate is a jQuery plugin that helps validate your HTML forms. It takes validation rules from the HTML 5 data attributes applied to each input. For example, let's assume we have a `first_name` text input in our form. We want our first name field to be required and have a length of at least 5 characters. The HTML markup would look like this:

````
<input type="text" id="first_name" name="first_name" class="required"  data-min-chars="5">
````

## Filters & Validations

jQuery Form Validate includes two main groups of functions, "filters" and "validations". Filters modify the value of an input before it is validated. The most common filter is `trim`. This function will remove all the leading and trailing white space of a form inputs value. This is most commonly used to make sure that a user actually entered something instead of just spaces. The full list of filters is as follows:

* *trim*(): Remove all leading and trailing white space
* *strtoupper*()`: Convert text to upper case
* *strtolower*(): Convert text to lower case

After all filters have been processed, then the validations are run. A validation looks at the value of the form input and an optional list of parameters, and then does some processing. The full list of validation functions along with their parameter requirements is as follows:

* *required*() -- Make it so form input is required.
* *required_if*( string **element id** ) -- Require an input only if a dependent element has a value.
* *between_numeric*( float **minimum**, float **maximum** ) -- See if a value is between a minimum and maximum value.
* *num_chars*( int **length** ) -- Validate that a string is exactly a certain number of characters in length.
* *min_chars*( int **minimum** ) -- Validate that a string is at least a certain number of characters in length.
* *max_chars*( int **maximum** ) -- Validate that a string is no more than a certain number of characters in length.
* *num_options*( int **minimum** ) -- Make sure a user selects exactly the provided number of checkboxes or multi-select form inputs.
* *min_options*( int **minimum** ) -- Make sure a user selects at least a provided number of checkboxes or multi-select form inputs.
* *max_options*( int **maximum** ) -- Make sure a user selects no more than a provided number of checkboxes or multi-select form inputs.
* *email*()`: Make sure a user entered a valid email
* *date*( string **format** ) -- Make sure the user entered a valid date in a valid date format. Format must be written as either "YYYY-MM-DD", "MM-DD-YYYY", or "DD-MM-YYYY".

## Breaking Down The Data Attributes

jQuery Form Validate uses the data attributes applied to your form inputs input to figure out which form validations to run.

## Complete Object Reference

### preProcess [ function *function(form, cssFailureClass, cssSuccessClass, cssFilterPrefix, cssValidationPrefix, cssParamDelimiter, failureWrapper )* ]

This function is fun before any form validation processing. By default this function removes all error and success classes and removes all error messages.

````
// Remove success and failure classes from inputs
$(form).find(':input.' + cssFailureClass + ', :input.' + cssSuccessClass).removeClass(cssFailureClass + ' ' + cssSuccessClass);

// Remove all error messages
$(form).find('.' + cssFailureClass).remove()
````

### postProcess [ function *function(form, inputs, O)* ]

This function is run after all form filter and validation rules are gathered. By default nothing is run in this function. However, the main form validation object must be returned.

````
return O;
````

### onSuccess [ function *function(form, inputs, O)* ]

This function is run after a form has successfully been validated. By default an alert message pops up. If you wanted to AJAX your form data this would be the place to add that logic.

````
alert('Great Success!');
return true;
````

### onFailure [ function *function(form, inputs, O)* ]

This function is run after a form fails validation. By default we loop through each input and find all the errors that were gathered. Then we append the error message inside the container DIV. Depending on how you layout your HTML forms this may need modification (**This is *very* important. Because the HTML of every form is different there is no one solution to placing error messages. Some tweaking may be needed in order to get the error messages displaying correctly**). This default code works best if you have one container DIV for each form element:

````
<div>
	<label for="name">
	<input name="name" class="required" title="Name" />
	<!--<span class="error">Error messages get appended at the end of the container DIV elements</span>-->
</div>
````

The default `onFailure` function is below:

````
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
````

### cssFailureClass [ string "*error*" ]

CSS class that gets added to all invalid form inputs and error messages.

### cssSuccessClass [ string "*success*" ]

CSS class that gets added to all form elements that pass validation.

### cssFilterPrefix [ string "*{empty string}*" ]

Prefix for form filters.

### cssValidationPrefix [ string "*{empty string}*" ]

Prefix for form validation functions.

### cssParamDelimiter [ string "*-*" ]

Used to designate parameters from within our CSS form validation functions. By default this is the `-` character. If we want to run the `between_numeric` validation function and have a minimum value of 5 and a maximum value of 10 the our CSS class would be `between_numeric-5-10`. Here we can see that the `-` character designates the start of the parameters and also serves to delimit each parameter.

### failureWrapper [ string "*\<span /\>*" ]

By default all error messages are wrapped in `<span />` tags. This results in error messages looking something like this:

````
<span class="error">First Name is required.</span>
````

### filters [ object *trim*, object *strtoupper*, object *strtolower* ]

All filters are run before validation functions. Filter function modify the input data and return the new data. Each function accepts two parameters, the form input, and an array of parameters. Even though no parameters are used for the default filter function, if you decided to create your own filter you can take advantage of this feature.

#### trim [ function *function(input, params)* ]

The trim function removes all leading and trailing whitespace.

#### strtoupper [ function *function(input, params)* ]

This function converts all text to uppercase.

#### strtolower [ function *function(input, params)* ]

This function converts all text to lowercase.

### validations [ object *between_numeric*, object *date*, object *email*, object *length*, object *min_length*, object *max_length*, object *options*, object *min_options*, object *max_options*, object *int*, object *float*, object *required_if*, object *required*, object *less_than*, object *greater_than* ]

Validation functions simply check to see if an input is valid. They can the boolean `true` or `false`. Each function accepts two parameters, the form input, and an array of parameters. Each validation function references an associated error message in the main form validation object. The error message is built using the `title` attribute of the form input, the value of the form input, and/or the parameters passed to each validation function.

---

#### between_numeric [ function *function(input, params)* ]

This function is used to determine if the input value is between two provided numbers.

---

#### date [ function *function(input, params)* ]

This function checks to see if a valid date was submitted. Dates are accepted in one of three formats: "YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY". Date parameter must be passed as either "YYYYMMDD", "DDMMYYYY", or "MMDDYYYY". The date string being validated may use a delimiter of either `-`, `/`, `,`, or `.`. 

---

#### email [ function *function(input, params)* ]

This function checks to see if a valid email was submitted. Email is validated using the regular expression `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i`.

---

#### length [ function *function(input, params)* ]

This function checks to see if an input is exactly the provided length.

---

#### min_length [ function *function(input, params)* ]

This function checks to see if an input is at least of a provided length.

---

#### max_length [ function *function(input, params)* ]

This function checks to see if an input is no longer than the provided number of characters.

---

#### options [ function *function(input, params)* ]

---

#### min_options [ function *function(input, params)* ]

This function checks to see if multi-select or checkbox inputs have at least a provided number of selections.

---

#### max_options [ function *function(input, params)* ]

This function checks to see if multi-select or checkbox inputs have no more than a provided number of selections.

---

#### int [ function *function(input, params)* ]

This function checks to see if a valid integer was provided.

---

#### required [ function *function(input, params)* ]

This function checks to see if any value was provided and the input is not blank.

---

#### required_if [ function *function(input, params)* ]

This function checks to see if any value was provided and the input is not blank *only* if the dependent input has a value.

---

#### less_than [ function *function(input, params)* ]

This function checks to see if a value is less than the provided number.

---

#### greater_than [ function *function(input, params)* ]

This function checks to see if a value is greater than the provided number.