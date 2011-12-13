# jQuery Form Validate

## Introduction

jQuery Form Validate is a jQuery plugin that helps validate your HTML forms. It takes validation rules from the CSS styles that you apply to each input. For example, let's assume we have a `first_name` text input in our form. We want our first name field to be required, have a leghth of at least 5 characters and a maximum length of 128 characters. The CSS classes that would would apply to this input would be as follows:

* **Required**: `fv_required`
* **Minimum length of 5 characters**: fv_min_length-5
* **Maximum length of 128 characters**: fv_max_length-128

Our HTML input element would look like this:

````
<input type="text" name="first_name" class="fv_required fv_min_length-5 fv_max_length-128" />
````

If we decided that instead of a minimum length of 5 characters we wanted a minimum length of 4 characters, our CSS class would instead be `fv_min_length-4`.

## Demo / Example

Access a [live demo](http://www.vmichnowicz.com/examples/formvalidate/index.html).