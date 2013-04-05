tooltip.css
========
inspired by [hint.css](https://github.com/chinchang/hint.css)

`tooltip.css` is written as a pure CSS resource using which you can create cool tooltips for your web app. It does not rely on JavaScript and rather uses **data-* attribute**, **pseudo elements**, **content property** and **CSS3 transitions** to create the tooltips. Also it uses **BEM** naming convention particularly for the modifiers.

*Note: CSS3 Transitions on pseudo elements is currently available on Firefox & IE10 only. On rest of the browsers it degrades gracefully without any transition. Though the good news is that it will be [coming soon on webkit](https://bugs.webkit.org/show_bug.cgi?id=92591) also (landed in Chrome 26 beta).*

Any element on your page which needs to have a tooltip has to be given at least one of the position classes: `tooltip-top`, `tooltip-bottom`, `tooltip-left`, `tooltip-right` to position the tooltip.

```html
Hello Sir, <span class="tooltip-bottom">hover me.</span>
```

The tooltip text needs to be given using the `data-tooltip` attribute on that element.

```html
Hello Sir, <span class="tooltip-bottom" data-tooltip="Thank you!">hover me.</span>
```

[ **Note**: The `tooltip` class is no more required and is deprecated. Tooltip is shown on elements which have the `data-tooltip` attribute instead.]

Use it with other available modifiers in various combinations. Available modifiers:
- `tooltip-error`
- `tooltip-info`
- `tooltip-warning`
- `tooltip-success`
- `tooltip-always`
- `tooltip-rounded`
