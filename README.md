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

* `trim`: Remove all leading and trailing white space
* `strtoupper`: Convert text to upper case
* `strtolower`: Convert text to lower case

After all filters have been processed, then the validations are run. A validation takes the value of the form input, an optional list of parameters, and then does some processing. If the input is valid it returns `true`, else, if the validation fails, it returns `false`. The full list of validation functions along with their parameter requirements is as follows:

* `required`: Make it so a form input value is required
* `between_numeric(minimum value, maximum value)`: See if a value is between a minimum and maximum value
* `min_length(minimum character length)`: Validate that a string is at least a certain number of characters in length
* `max_length(maximum character length)`: Validate that a string is no more than a certain number of characters in length
* `min_options(minimum number of options)`: Make sure a user selects at least a provided number of checkboxes or multi-select form inputs
* `max_options(maximum number of options)`: Make sure a user selects no more than a provided number of checkboxes or multi-select form inputs
* `email`: Make sure a user entered a valid email
* `date(date format written as either "YYYYMMDD", "MMDDYYYY", or "DDMMYYYY")`: Make sure the user entered a valid date in a valid date format

## Breaking Down The CSS Classes

Coming soon...

## Demo / Example

Access a [live demo](http://www.vmichnowicz.com/examples/formvalidate/index.html).