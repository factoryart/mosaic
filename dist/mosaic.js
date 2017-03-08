(function() {
  var Mosaic, camelize,
    __slice = [].slice;

  Mosaic = (function() {
    var extend;

    Mosaic.prototype.defaultOptions = {
      density: 5,
      interval: 5000,
      items: '.item',
      "in": 'fadeIn',
      out: 'fadeOut',
      replace: 1,
      url: '/photos.json'
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Mosaic(element, options) {
      var elementOptions, _ref;
      this.element = element;
      this.photos = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      Mosaic.instances.push(this);
      this.element.mosaic = this;
      elementOptions = (_ref = Mosaic.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      this.init();
    }

    Mosaic.prototype.addPhoto = function(photo) {
      return this.photos.push(photo);
    };

    Mosaic.prototype.removePhotos = function() {
      return this.photos = [];
    };

    Mosaic.prototype.items = function() {
      return $(this.element).find(this.options.items);
    };

    Mosaic.prototype.active_items = function() {
      return this.items().filter('.active');
    };

    Mosaic.prototype.non_active_items = function() {
      return this.items().not('.active');
    };

    Mosaic.prototype.simultaneous_photos_count = function() {
      return Math.round(this.items().length / (100 / (this.options.density * 10)));
    };

    Mosaic.prototype.shuffle = function(array) {
      var i, m, t;
      m = array.length;
      t = void 0;
      i = void 0;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    };

    Mosaic.prototype.push_photo = function() {
      return this.photos.push(this.photos.shift());
    };

    Mosaic.prototype.clear = function(count) {
      var elements;
      if (count == null) {
        count = this.active_items().length;
      }
      elements = this.shuffle(this.active_items()).slice(this.active_items().length - count);
      elements.addClass(this.options.out);
      elements.removeClass('active');
      return elements.removeAttr('style');
    };

    Mosaic.prototype.draw = function(count) {
      if (count == null) {
        count = this.simultaneous_photos_count();
      }
      this.clear(count);
      return this.shuffle(this.non_active_items()).slice(this.non_active_items().length - count).each((function(_this) {
        return function(index, element) {
          $(element).removeClass(_this.defaultOptions.out);
          $(element).addClass('animated active').addClass(_this.options["in"]);
          $(element).css('background-image', "url(" + _this.photos[0].asset + ")");
          $(element).find('img').attr('title', _this.photos[0].title);
          $(element).find('img').attr('alt', _this.photos[0].title);
          return _this.push_photo();
        };
      })(this));
    };

    Mosaic.prototype.startDrawing = function() {
      this.draw();
      return setInterval(((function(_this) {
        return function() {
          _this.draw(_this.options.replace);
        };
      })(this)), this.options.interval);
    };

    Mosaic.prototype.retrieve = function() {
      return $.getJSON(this.options.url).done((function(_this) {
        return function(data) {
          $.each(_this.shuffle(data), function(key, val) {
            return _this.addPhoto(val);
          });
          return _this.startDrawing();
        };
      })(this)).fail(function(jqxhr, textStatus, error) {
        var err;
        err = textStatus + ', ' + error;
        return console.log('Request Failed: ' + err);
      });
    };

    Mosaic.prototype.init = function() {
      this.retrieve();
      return this.clear();
    };

    return Mosaic;

  })();

  Mosaic.options = {};

  Mosaic.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Mosaic.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Mosaic.instances = [];

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.mosaic = function(options) {
      return this.each(function() {
        return new Mosaic(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Mosaic;
  } else {
    window.Mosaic = Mosaic;
  }

}).call(this);
