# jQuery Form Validate

## License

jQuery Form Validate is licensed under the [MIT](http://opensource.org/licenses/MIT) license.

## Demo / Example

Access a [live demo](http://www.vmichnowicz.com/examples/formvalidate/index.html).

## Introduction

jQuery Form Validate is a jQuery plugin that helps validate your HTML forms. It takes validation rules from the HTML 5 data attributes applied to each input. For example, let's assume we have a `first_name` text input in our form. We want our first name field to be required and have a length of at least 5 characters. The HTML markup would look like this:

```
<input type="text" id="first_name" name="first_name" class="required"  data-min-chars="5">
```

## Filters & Validations

jQuery Form Validate includes two main groups of functions, "filters" and "validations". Filters modify the value of an input before it is validated. The most common filter is `trim`. This function will remove all the leading and trailing white space of a form inputs value. This is most commonly used to make sure that a user actually entered something instead of just spaces. The full list of filters is as follows:

* *trim*() - Remove all leading and trailing white space
* *strtoupper*() - Convert text to upper case
* *strtolower*() - Convert text to lower case

After all filters have been processed, then the validations are run. A validation looks at the value of the form input and an optional list of parameters, and then does some processing. The full list of validation functions along with their parameter requirements is as follows:

* *required*() - Make it so form input is required.
* *requiredIf*( string **element id** ) - Require an input only if a dependent element has a value.
* *betweenNumeric*( float **minimum**, float **maximum** ) - See if a value is between a minimum and maximum value.
* *numChars*( int **length** ) - Validate that a string is exactly a certain number of characters in length.
* *minChars*( int **minimum** ) - Validate that a string is at least a certain number of characters in length.
* *maxChars*( int **maximum** ) - Validate that a string is no more than a certain number of characters in length.
* *numOptions*( int **minimum** ) - Make sure a user selects exactly the provided number of checkboxes or multi-select form inputs.
* *minOptions*( int **minimum** ) - Make sure a user selects at least a provided number of checkboxes or multi-select form inputs.
* *maxOptions*( int **maximum** ) - Make sure a user selects no more than a provided number of checkboxes or multi-select form inputs.
* *email*() - Make sure a user entered a valid email
* *date*( string **format** ) - Make sure the user entered a valid date in a valid date format. Format must be written as either "YYYY-MM-DD", "MM-DD-YYYY", or "DD-MM-YYYY".

## Breaking Down The Data Attributes

jQuery Form Validate uses the data attributes applied to your form inputs input to figure out which form validations to run.

## Publically Available Properties

### messageParent

CSS selector of parent element of success and failure message. By default this is `div`. This selector is relative to each input. Starting at the input we go through each parent and see if it matches the provided selector. This will tell us were to place each error and success messages. For this reason it is nice to wrap each set of labels and inputs in some sort of container element.

### messageElement

Wrap success and failure messages inside this element. By default this is `<span />`.

### failureMessages

Boolean option to display failure messages. Defaults to `true`.

### successMessages

Boolean option to display success messages. Defaults to `false`.

### messageFailureClass

CSS class(es) applied to failure messages. Defaults to `error`. Multiple CSS classes can be applied by through space delineation i.e. `error error-text`.

### messageSuccessClass

CSS class(es) applied to success messages. Defaults to `success`. Multiple CSS classes can be applied by through space delineation i.e. `success success-text`.

### inputFailureClass

CSS class(es) added to inputs that did not pass validation. Defaults to `error`. Multiple CSS classes can be applied by through space delineation i.e. `error error-text`.

### inputSuccessClass

CSS class added to inputs that did pass validation. Defaults to `success`. Multiple CSS classes can be applied by through space delineation i.e. `success success-text`.

### language

Set the language for error and success messages. Defaults to `en` for English. Deutsch `de`, English `en`, Espa&ntilde;ol `es`, and Pirate `pirate` are available.

## Publicly Available Methods

### preProcess [ function *function(form, options, inputFailureClass, inputSuccessClass, messageFailureClass, messageSuccessClass, messageElement)* ]

This function is run before any form validation processing. By default this function removes all failure and success classes from inputs and and removes all failure and success messages.

### postProcess [ function *function(form, inputs)* ]

This function is run after all form filter and validation rules are gathered. By default nothing is run in this function.

### onSuccess [ function *function(form, inputs, options)* ]

This function is run after a form has successfully been validated. By default the form is submitted. If you wanted to AJAX your form data this would be the place to add that logic.

### onFailure [ function *function(form, inputs, options)* ]

## Filters

All filters are run before validation functions. Filter function modify the input data and return the new data. Each function accepts two parameters, the form input, and an array of parameters. Even though no parameters are used for the default filter function, if you decided to create your own filter you can take advantage of this feature.

### trim [ function *function(input, params)* ]

The trim function removes all leading and trailing whitespace.

### strtoupper [ function *function(input, params)* ]

This function converts all text to uppercase.

### strtolower [ function *function(input, params)* ]

This function converts all text to lowercase.

## Validations

Validation functions simply check to see if an input is valid. Validation functions return the boolean `true` or `false`. Each function accepts two parameters, the form input, and an array of parameters. Each validation function references an associated error message. Validations, are applied by including data attributes in an HTML form input. Data attributes are dashed versions of these method names below. For example, the `requiredIf` method would need a HTML data attribute of `required-if`.

### betweenNumeric [ function *function(input, params)* ]

This function is used to determine if the input value is between two provided numbers.

### date [ function *function(input, params)* ]

This function checks to see if a valid date was submitted. Dates are accepted in one of three formats: "YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY". The date string being validated may use a delimiter of either `-`, `/`, `,`, or `.`. 

### email [ function *function(input, params)* ]

This function checks to see if a valid email was submitted. Email is validated using the regular expression `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i`.

### numChars [ function *function(input, params)* ]

This function checks to see if an input is exactly the provided length.

### minChars [ function *function(input, params)* ]

This function checks to see if an input is at least of a provided length.

### maxChars [ function *function(input, params)* ]

This function checks to see if an input is no longer than the provided number of characters.

### numOptions [ function *function(input, params)* ]

### minOptions [ function *function(input, params)* ]

This function checks to see if multi-select or checkbox inputs have at least a provided number of selections.

### maxOptions [ function *function(input, params)* ]

This function checks to see if multi-select or checkbox inputs have no more than a provided number of selections.


### int [ function *function(input, params)* ]

This function checks to see if a valid integer was provided.

### required [ function *function(input, params)* ]

This function checks to see if any value was provided and the input is not blank.

### requiredIf [ function *function(input, params)* ]

This function checks to see if any value was provided and the input is not blank *only* if the dependent input has a value.

### lessThan [ function *function(input, params)* ]

This function checks to see if a value is less than the provided number.

### greaterThan [ function *function(input, params)* ]

This function checks to see if a value is greater than the provided number.

## Complete Object Reference (Hierarchy)

* preProcess
* postProcess
* onSuccess
* onFailure
* messageParent
* messageElement
* failureMessages
* successMessages
* messageFailureClass
* messageSuccessClass
* inputFailureClass
* inputSuccessClass
* cssParamDelimiter
* language
* localization
  * en
    * success
      * default
      * betweenNumeric
      * date
      * email
      * numChars
      * minChars
      * maxChars
      * numOptions
      * minOptions
      * maxOptions
      * int
      * float
      * required
      * requiredIf
      * lessThan
      * greaterThan
    * failure
      * default
* filters
  * trim
  * strtoupper
  * strtolower
* validations
  * betweenNumeric
  * date
  * dateAfter
  * dateBefore
  * email
  * numChars
  * minChars
  * maxChars
  * numOptions
  * minOptions
  * maxOptions
  * int
  * float
  * required
  * requiredIf
  * lessThan
  * greaterThan
