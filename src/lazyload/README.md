## A very lightweight plugin to lazy load images


#### Usage
Use a placeholder image in the src attribute - something to be displayed while the original image loads - and include the actual image source in a "data-src" attribute.
If you want to serve high-resolution images to devices with retina displays, you just have to include the source for those images in a "data-src-retina" attribute.
You don't need to include a "data-src-retina" attribute in all the image tags, lazyload is smart enough to fallback to "data-src" or even do nothing in case there isn't any "data-src" specified.
```html
<img src="bg.png" data-src="img1.jpg" />
<img src="bg.png" data-src="img2.jpg" data-src-retina="img2-retina.jpg" />
```
If you care about users without javascript enabled, you can include the original image inside a ```noscript``` tag:
```html
<noscript>
  <img src="bg.png" src="img1.jpg" />
</noscript>
```
Run the script on document ready:
```javascript
$(document).ready(function() {
  $("img").lazyload();
});
```



###Option
By default, images are only loaded and "lazyloaded" when user scrolls to them and they became visible on the screen.
If you want your images to load earlier than that, lets say 200px before they appear on the screen, you just have to:
```javascript
$("img").lazyload( 200 );
```


###Trigger
You can still trigger image loading whenever you need.
All you have to do is select the images you want to "lazyload" and trigger the event:
```javascript
$("img").trigger("lazyload");
```

