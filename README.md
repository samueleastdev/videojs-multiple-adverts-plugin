# S3bubble Videojs Multi Adverts

Add multiple video adverts to video js from Amazon Web Serivces

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation

```sh
npm install --save videojs-s3bubble-multi-adverts
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-s3bubble-multi-adverts
```

## Usage

To include videojs-s3bubble-multi-adverts on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<video id=example-video width=600 height=300 class="video-js vjs-default-skin" controls>
  <source
     src="https://example.com/index.m3u8"
     type="application/x-mpegURL">
</video>
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-s3bubble-multi-adverts.min.js"></script>
<script>
  	var player = videojs('my-video');

  	$.ajax({
        url: "https://xe309ni835.execute-api.us-east-1.amazonaws.com/testing/adverts",
        type: "POST",
        data: JSON.stringify({
            "code": settings.code
        }),
        contentType: 'application/json',
        dataType: "json",
        success: function(response){

            if(response.statusCode === "200"){

                videoPlayer.s3BubbleMultiAdverts(response);

            }else{

                console.log("error",response);

            }
           
        }

    });
</script>
```

Check out our [live example](http://jsbin.com/tafanac/edit?html,output) if you're having trouble.

### Browserify

When using with Browserify, install videojs-s3bubble-multi-adverts via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-s3bubble-multi-adverts');

var player = videojs('my-video');

player.s3BubbleMultiAdverts();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-s3bubble-multi-adverts'], function(videojs) {
  var player = videojs('my-video');

  player.s3BubbleMultiAdverts();
});
```

## License

MIT. Copyright (c) S3Bubble


[videojs]: http://videojs.com/
