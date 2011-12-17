# jQuery Form Validate

## Introduction

jQuery Form Validate is a jQuery plugin that helps validate your HTML forms. It takes validation rules from the CSS styles that you apply to each input. For example, let's assume we have a `first_name` text input in our form. We want our first name field to be required, have a leghth of at least 5 characters and a maximum length of 128 characters. The CSS classes that would would apply to this input would be as follows:

* **Required**: `fv_required`
* **Minimum length of 5 characters**: `fv_min_length-5`
* **Maximum length of 128 characters**: `fv_max_length-128`

Our HTML input element would look like this:

````
<input type="text" name="first_name" class="fv_required fv_min_length-5 fv_max_length-128" />
````

If we decided that instead of a minimum length of 5 characters we wanted a minimum length of 4 characters, our CSS class would instead be `fv_min_length-4`.

## Filters & Validations

jQuery Form Validate includes two main groups of functions, "filters" and "validations". Filters modify the value of an input before it is validated. The most common filter is `trim`. This function will remove all the leading and trailing white space of a form inputs value. This is most commonly used to make sure that a user actually entered something instead of just spaces. The full list of filters is as follows:

* *trim*(): Remove all leading and trailing white space
* *strtoupper*()`: Convert text to upper case
* *strtolower*(): Convert text to lower case

After all filters have been processed, then the validations are run. A validation takes the value of the form input, an optional list of parameters, and then does some processing. If the input is valid it returns `true`, else, if the validation fails, it returns `false`. The full list of validation functions along with their parameter requirements is as follows:

* *required*() -- Make it so form input is required.
* *between_numeric*( int **minimum**, int **maximum** ) -- See if a value is between a minimum and maximum value.
* *min_length*( int **minimum** ) -- Validate that a string is at least a certain number of characters in length.
* *max_length*( int **maximum** ) -- Validate that a string is no more than a certain number of characters in length.
* *min_options*( int **minimum** ) -- Make sure a user selects at least a provided number of checkboxes or multi-select form inputs.
* *max_options*( int **maximum** ) -- Make sure a user selects no more than a provided number of checkboxes or multi-select form inputs.
* *email*()`: Make sure a user entered a valid email
* *date*( string **format** ) -- Make sure the user entered a valid date in a valid date format. Format must be written as either "YYYYMMDD", "MMDDYYYY", or "DDMMYYYY".

## Breaking Down The CSS Classes

jQuery Form Validate uses the CSS classes assigned to your input elements to figure out which form validations to run. Because of this you may want to prefix your CSS validation classes. By default the validation prefix for all filter functions is `ff_` and the prefix for all form validation functions is `fv_`. With these defaults you must prefix all functions that you want to run. So, for example, if you want to make an element required it would look similar to this:

````
<input type="text" name="age" class="fv_required" />
````

If you want to change the prefix (or even remove it) you can do that in that during the initialization of the plugin:

````
$(document).ready(function() {
  $('form').formvalidate({
		cssFilterPrefix: 'new_filter_prefix_', // Add prefix of "new_filter_prefix_" for all filter functions
		cssValidationPrefix: '', // Remove prefix
	});
});
````

With these new prefixes in place making an element required and running the trim filter would look like this:

````
<input type="text" name="middle_name" class="new_filter_prefix_trim required" />
````

## Demo / Example

Access a [live demo](http://www.vmichnowicz.com/examples/formvalidate/index.html).