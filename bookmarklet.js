(function() {
  'use strict';
  var emBookmarklet = {
    
    // Properties
    containerID: 'tmbritton-embookmarklet',
    displayID: 'emdisplay',
    cssUrl: 'bookmarklet.css',
    emid: 'ems',
    pxid: 'pixels',
    yardstickID: 'tmbritton-embookmarkletyardstick',
    closeIconId: 'tmbritton-embookmarklet-close',
    stylesheetId: 'tmbritton-embookmarklet-css',
    faStylesheetId: 'tmbritton-embookmarklet-fa-css',

    // Methods

    /**
     *  Attach event listeners.
     */
    addListeners: function(element, listener, callback) {
      if(element.addEventListener) {
        element.addEventListener(listener, function() {
          callback();
        }, true);
      }
      else {
        console.log('This browser does not support Javascript event binding');
      }
    },

    /**
     *  Create container for width value display.
     */
    constructContainer: function() {
      var container = document.createElement('div'),
          closeIcon = document.createElement('i'),
          anchor = document.createElement('a');
      container.setAttribute('id', emBookmarklet.containerID);
      anchor.setAttribute('id', emBookmarklet.closeIconId);
      anchor.setAttribute('href', '#');
      closeIcon.className = ('fa fa-times');
      anchor.appendChild(closeIcon);
      container.appendChild(anchor);
      emBookmarklet.addListeners(anchor, 'click', emBookmarklet.deleteElements);
      return container;
    },

    /**
     *  Create <p> to hold values.
     */
    constructDisplay: function() {
      var display = document.createElement('p');
      display.setAttribute('id', emBookmarklet.displayID);
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.emid));
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.pxid));
      return display;
    },

    /**
     *  Create Font Awesome CSS <link> tag.
     *  @return object
     *    <link> dom element
     */
    constructFaStyles: function() {
      var styles = document.createElement('link'),
          attributes = [
            ['rel', 'stylesheet'],
            ['href', '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'],
            ['id', emBookmarklet.faStylesheetId]
          ];
      attributes.forEach(function(element) {
        styles.setAttribute(element[0], element[1]);
      });
      return styles;
    },

    /**
     *  Create <span> elements that are targets for the width values.
     *  @param string id
     *    id attribute for the span.
     *  @return object
     *    <span> dom element
     */
    constructSpans: function(id) {
      var span = document.createElement('span');
      span.setAttribute('id', id);
      return span;
    },

    /**
     *  Create bookmarklet CSS <link> element.
     *  @return object
     *    <link> dom element.
     */
    constructStyles: function() {
      var styles = document.createElement('link'),
          attributes = [
            ['rel', 'stylesheet'],
            ['href', emBookmarklet.cssUrl],
            ['type', 'text/css'],
            ['media', 'screen'],
            ['id', emBookmarklet.stylesheetId]
          ];
      attributes.forEach(function(element) {
        styles.setAttribute(element[0], element[1]);
      });
      return styles;
    },

    /**
     *  Add display of values to DOM.
     */
    createPanel: function() {
      var container = emBookmarklet.constructContainer(),
          display = emBookmarklet.constructDisplay(),
          styles = emBookmarklet.constructStyles(),
          fa_styles = emBookmarklet.constructFaStyles();
      container.appendChild(display);
      document.body.appendChild(container);
      document.body.appendChild(styles);
      document.body.appendChild(fa_styles);
    },

    /**
     *  Add 1em x 1em div to the DOM. Inline styles so that there's not a time when there element
     *  is present before the stylesheet loads. This lead to incorrect values.
     */
    createYardstick: function() {
      var div = document.createElement('div'),
          styles = [
            ['width', '1em'],
            ['height', '1em'],
            ['display', 'inline'],
            ['position', 'absolute'],
            ['left', '-9999px']
          ];
      div.setAttribute('id', emBookmarklet.yardstickID);
      styles.forEach(function(element) {
        div.style[element[0]] = element[1];
      });
      document.body.appendChild(div);
    },

    /**
     *  Remove created elements from the DOM.
     */
    deleteElements: function() {
      var bookmarkletElements = [
        document.getElementById(emBookmarklet.containerID),
        document.getElementById(emBookmarklet.yardstickID),
        document.getElementById(emBookmarklet.stylesheetId),
        document.getElementById(emBookmarklet.faStylesheetId)
      ];
      bookmarkletElements.forEach(function(element) {
        document.body.removeChild(element);
      });
    },

    /**
     *  Get the width of our measuring element in ems.
     *  @return int
     *    Element width in ems.
     */
    getWidthEms: function() {
      var yardstick = document.getElementById(emBookmarklet.yardstickID),
          emWidth = yardstick.offsetWidth,
          windowWidth = emBookmarklet.getWindowWidthPixels(),
          totalEms = windowWidth / emWidth;
      return Math.round(totalEms);
    },

    /**
     *  Get the window width in pixels.
     *  @return int
     *    Window width in pixels.
     */
    getWindowWidthPixels: function() {
      if (window.innerWidth) {
        return window.innerWidth;
      }
      else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientWidth;
      }
      else if (document.body) {
        return document.body.clientWidth;
      }
      return 0;
    },

    /**
     *  Kick it off
     */
    init: function() {
      emBookmarklet.createYardstick();
      emBookmarklet.createPanel();
      emBookmarklet.updateMeasurements();
      emBookmarklet.addListeners(window, 'resize', emBookmarklet.updateMeasurements);
    },

    /**
     *  Set the display value of ems.
     *  @param number number
     */
    setEmDisplay: function(number) {
      var text = number + 'em',
          span = document.getElementById(emBookmarklet.emid);
      span.innerHTML = text;
    },

    /**
     *  Set the display value of pixels.
     *  @param number number
     */
    setPixelDisplay: function(number) {
      var text = number + 'px',
          span = document.getElementById(emBookmarklet.pxid);
      span.innerHTML = text;
    },

    /**
     *  Update the display of values.
     */
    updateMeasurements: function() {
      var pxWidth = emBookmarklet.getWindowWidthPixels(),
          emWidth = emBookmarklet.getWidthEms();
      emBookmarklet.setPixelDisplay(pxWidth);
      emBookmarklet.setEmDisplay(emWidth);
    },
  };

  // Execute the script
  emBookmarklet.init();
})();
