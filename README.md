<img src="https://github.com/factoryart/mosaic/raw/master/demo/example.gif" width="640">

Mosaic.js is a simple library to display asynchronous photo-grids with animation effects.

## Requirements

+ You need jQuery installed.
+ [Animate.css](https://daneden.github.io/animate.css/) to display CSS animations.

## Getting Started

By default Mosaic looks for child elements with the class name `.item`. You can change this class name by passing a different value to _items_ (see Configuration below). 

Your minimal markup should look something like this.

```html
<div id="mosaicContainer">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```

You need to provide a URL with a JSON file including the list of photos. Only `asset` attribute is required. 
You can also add as many additional attributes as needed.

```json
[
  { 
    "asset": "/mosaic/1.jpg",
    "title": "Optional title"
  },
  { 
    "asset": "/mosaic/2.jpg"
  }
]
```

Initiate the Mosaic referring the `id` of your container. 

```javascript
var myMosaic = new Mosaic("#mosaicContainer", {
 url: '/photos.json' 
})
```

Since you are using jQuery you can also configure it like this.

```javascript
​$("#mosaicContainer").mosaic();
```

Mosaic.js positions photos as backgrounds to make sure they will look who and you can use new CSS grid layouts. Make sure to include the following CSS and adjust width and height dimensions of your items as needed. 

```css
.item {
  background-size: cover;
  background-position: center;
  width: 150px;
  height: 150px;
}
```

## Configuration

#### url

The url where the JSON file containing the photos is located. JSON should be a simple array of items with an attribute `asset` and the url of the photo. 

#### density

Percentage of simultaneous photos showing on screen. Values from `1` to `10`.

#### interval

Time between photo changes in milliseconds. Defaults to `5000`.

#### items

Class name of child elements. Default is `.item`.

#### in

Class name added when item is displayed. Default is `fadeIn`.

#### out

Class name added when item is hidden. Default is `fadeOut`.

#### replace

Number of items that are being replaced at the same time. Defaults to `1`.

## Methods

You can call the following methods from your Mosaic object.

#### startDrawing

Begin drawing the initial and continuous photos on screen.

```javascript
myMosaic.startDrawing()
```

#### draw

Draw the next photo according to the `replace` configuration.

```javascript
myMosaic.draw()
```

#### photos

Displays list of photos in JSON format. Photos are shuffled when retrieved and then will be shown in the order of this array.

```javascript
myMosaic.photos()
```

#### retrieve

Retrieve a list of photos from the URL. You can call this again if the source URL is dynamic and photos changes.

```javascript
myMosaic.retrieve()
```

#### removePhotos

Removes all photos from the array.

```javascript
myMosaic.removePhotos()
```

## MIT License

See LICENSE file. Special thanks to Matias Meno. Much of the organization of this library has been inspired from Dropzone.