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

    buildAttributesFromObject: function(object) {
      var out = '';
      for (var key in object) {
        out += key +':' + object[key] + '; ';
      }
      return out.trim();
    },

    /**
     *  Build DOM elements from element name and attributes.
     *  @param string element
     *    Name of HTML element to build.
     *  @param object attributes
     *    HTML element attributes in key => value pairs.
     */
    buildElement: function(element, attributes) {
      var dom_element = document.createElement(element);
      for (var attribute in attributes) {
        if (typeof attributes[attribute] !== 'object') {
          dom_element.setAttribute(attribute, attributes[attribute]);
        }
        else {
          dom_element.setAttribute(attribute, emBookmarklet.buildAttributesFromObject(attributes[attribute]));
        }
      }
      return dom_element;
    },

    /**
     *  Create container for width value display.
     */
    constructContainer: function() {
      var containerAttributes = {
            id: emBookmarklet.containerID,
          },
          anchorAttributes = {
            id: emBookmarklet.closeIconId,
            href: '#',
            title: 'Close'
          },
          iconAttributes = {
            class: 'fa fa-times',
          },
          container = emBookmarklet.buildElement('div', containerAttributes),
          closeIcon = emBookmarklet.buildElement('i', iconAttributes),
          anchor = emBookmarklet.buildElement('a', anchorAttributes);

      anchor.appendChild(closeIcon);
      container.appendChild(anchor);
      emBookmarklet.addListeners(anchor, 'click', emBookmarklet.deleteElements);
      return container;
    },

    /**
     *  Create <p> to hold values.
     */
    constructDisplay: function() {
      var displayAttributes = {
            id: emBookmarklet.displayID,
          },
          emSpanAttributes = {
            id: emBookmarklet.emid,
          },
          pxSpanAttributes = {
            id: emBookmarklet.pxid,
          },
          display = emBookmarklet.buildElement('p', displayAttributes),
          emSpan = emBookmarklet.buildElement('span', emSpanAttributes),
          pxSpan = emBookmarklet.buildElement('span', pxSpanAttributes);

      display.appendChild(emSpan);
      display.appendChild(pxSpan);

      return display;
    },

    /**
     *  Create bookmarklet CSS <link> element.
     *  @return object
     *    <link> dom element.
     */
    constructStyles: function() {
      var styleAttributes = {
            rel: 'stylesheet',
            href: emBookmarklet.cssUrl,
            type: 'text/css',
            media: 'screen',
            id: emBookmarklet.stylesheetId
          },
          faStyleAttributes = {
            rel: 'stylesheet',
            href: '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
            id: emBookmarklet.faStylesheetId
          },
          styles = emBookmarklet.buildElement('link', styleAttributes),
          faStyles = emBookmarklet.buildElement('link', faStyleAttributes);

      document.body.appendChild(styles);
      document.body.appendChild(faStyles);
    },

    /**
     *  Add display of values to DOM.
     */
    createPanel: function() {
      var container = emBookmarklet.constructContainer(),
          display = emBookmarklet.constructDisplay();
      container.appendChild(display);
      document.body.appendChild(container);
      emBookmarklet.constructStyles();
    },

    /**
     *  Add 1em x 1em div to the DOM. Inline styles so that there's not a time when there element
     *  is present before the stylesheet loads. This lead to incorrect values.
     */
    createYardstick: function() {
      var attributes = {
            id: emBookmarklet.yardstickID,
            style: {
              width: '1em',
              height: '1em',
              display: 'inline',
              position: 'absolute',
              left: '-9999px'
            }
          },
          yardstick = emBookmarklet.buildElement('div', attributes);

      document.body.appendChild(yardstick);
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
