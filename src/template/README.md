template
========

$.template(templateString, [data], [settings])

Compiles JavaScript templates into functions that can be evaluated for rendering.
Useful for rendering complicated bits of HTML from JSON data sources.
Template functions can both interpolate variables, using <%= … %>,
as well as execute arbitrary JavaScript code, with <% … %>. If you wish to interpolate a value,
 and have it be HTML-escaped, use <%- … %> When you evaluate a template function,
 pass in a data object that has properties corresponding to the template's free variables.
 If you're writing a one-off, you can pass the data object as the second parameter to template
  in order to render immediately instead of returning a template function.
  The settings argument should be a hash containing any $.templateSettings that should be overridden.

```
var compiled = $.template("hello: <%= name %>");
compiled({name : 'moe'});
=> "hello: moe"

var list = "<% $.each(people, function(i,name) { %> <li><%= name %></li> <% }); %>";
$.template(list, {people : ['moe', 'curly', 'larry']});
=> "<li>moe</li><li>curly</li><li>larry</li>"

var template = $.template("<b><%- value %></b>");
template({value : '<script>'});
=> "<b>&lt;script&gt;</b>"
```

You can also use print from within JavaScript code. This is sometimes more convenient than using <%= ... %>.

```
var compiled = $.template("<% print('Hello ' + epithet); %>");
compiled({epithet: "stooge"});
=> "Hello stooge."
```

If ERB-style delimiters aren't your cup of tea, you can change Underscore's template settings to use different symbols to set off interpolated code. Define an interpolate regex to match expressions that should be interpolated verbatim, an escape regex to match expressions that should be inserted after being HTML escaped, and an evaluate regex to match expressions that should be evaluated without insertion into the resulting string. You may define or omit any combination of the three. For example, to perform Mustache.js style templating:

```
$.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var template = $.template("Hello {{ name }}!");
template({name : "Mustache"});
=> "Hello Mustache!"
```

By default, template places the values from your data in the local scope via the with statement.
However, you can specify a single variable name with the variable setting. This can significantly
improve the speed at which a template is able to render.

```
$.template("Using 'with': <%= data.answer %>", {answer: 'no'}, {variable: 'data'});
=> "Using 'with': no"
```

Precompiling your templates can be a big help when debugging errors you can't reproduce.
This is because precompiled templates can provide line numbers and a stack trace,
 something that is not possible when compiling templates on the client.
 The source property is available on the compiled template function for easy precompilation.