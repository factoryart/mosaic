class Mosaic
  # Default settings
  defaultOptions:
    density: 5  # Values from 1-10
    interval: 5000
    items: '.item'
    effect_in: 'fadeIn'
    effect_out: 'fadeOut'
    replace: 1
    url: '/photos.json'

  extend = (target, objects...) ->
    for object in objects
      target[key] = val for key, val of object
    target

  constructor: (@element, options) ->
    @photos = []

    @element = document.querySelector @element if typeof @element == "string"

    # Now add this dropzone to the instances.
    Mosaic.instances.push @

    # Put the dropzone inside the element itself.
    @element.mosaic = @

    elementOptions = Mosaic.optionsForElement(@element) ? { }

    @options = extend { }, @defaultOptions, elementOptions, options ? { }

    @init()

  addPhoto: (photo) ->
    @photos.push photo

  removePhotos: ->
    @photos = []

  items: ->
    $(@element).find(this.options.items)

  active_items: ->
    @items().filter('.active')

  non_active_items: ->
    @items().not('.active')

  simultaneous_photos_count: ->      
    Math.round(@items().length / (100 / (@options.density * 10)))      

  shuffle: (array) ->
    m = array.length
    t = undefined
    i = undefined
    # While there remain elements to shuffle…
    while m
      # Pick a remaining element…
      i = Math.floor(Math.random() * m--)
      # And swap it with the current element.
      t = array[m]
      array[m] = array[i]
      array[i] = t
    array

  push_photo: ->
    @photos.push @photos.shift()

  clear: (count = @active_items().length) ->
    elements = @shuffle(@active_items()).slice(@active_items().length - count)

    elements.addClass(this.options.effect_out)
    elements.removeClass('active')
    elements.removeAttr('style')

  draw: (count = @simultaneous_photos_count() ) ->       
    @clear(count)
    @shuffle(@non_active_items()).slice(@non_active_items().length - count).each (index, element) =>
      $(element).removeClass(this.defaultOptions.effect_out)
      $(element).addClass('animated active').addClass(this.options.effect_in)      
      $(element).css('background-image', "url(#{@photos[0].asset})" )
      $(element).find('img').attr('title',@photos[0].title)
      $(element).find('img').attr('alt',@photos[0].title)
      @push_photo()

  startDrawing: ->  
    @draw()
    setInterval (=>
      @draw this.options.replace
      return
    ), this.options.interval

  retrieve: ->
    $.getJSON(this.options.url).done((data) =>              
      $.each @shuffle(data), (key, val) =>
        @addPhoto val
      @startDrawing()
    ).fail (jqxhr, textStatus, error) ->
      err = textStatus + ', ' + error
      console.log 'Request Failed: ' + err

  init: ->
    @retrieve()
    @clear()

Mosaic.options = { }

# Returns the options for an element or undefined if none available.
Mosaic.optionsForElement = (element) ->
  # Get the `Dropzone.options.elementId` for this element if it exists
  if element.getAttribute("id") then Mosaic.options[camelize element.getAttribute "id"] else undefined

# Holds a list of all mosaic instances
Mosaic.instances = [ ]

# abc-def_ghi -> abcDefGhi
camelize = (str) -> str.replace /[\-_](\w)/g, (match) -> match.charAt(1).toUpperCase()

# Augment jQuery
if jQuery?
  jQuery.fn.mosaic = (options) ->
    this.each -> new Mosaic this, options  

if module?
  module.exports = Mosaic
else
  window.Mosaic = Mosaic