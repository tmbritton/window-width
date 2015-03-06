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
      if (typeof element == 'string') {
        element = document.getElementById(element);
      } 
      if (element.addEventListener) {
        element.addEventListener(listener, function() {
          callback();
        }, true);
      }
      else {
        console.log('This browser does not support Javascript event binding.');
      }
    },

    /**
     *  Build string to use in style CSS attribute.
     *  @param object object
     *  @return string
     */
    buildAttributesFromObject: function(object) {
      var out = '';
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          out += key +':' + object[key] + '; ';
        }
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
        if (attributes.hasOwnProperty(attribute)) {
          if (typeof attributes[attribute] !== 'object') {
            dom_element.setAttribute(attribute, attributes[attribute]);
          }
          else {
            dom_element.setAttribute(attribute, emBookmarklet.buildAttributesFromObject(attributes[attribute]));
          }
        }
      }
      return dom_element;
    },

    /**
     *  Loop over object and create HTML DOM elements.
     */
    createElements: function() {
      var elements = {
        mainCSS: {
          type: 'link',
          attributes: {
            rel: 'stylesheet',
            href: emBookmarklet.cssUrl,
            type: 'text/css',
            media: 'screen',
            id: emBookmarklet.stylesheetId
          },
          parentElement: document.body
        },
        faCSS: {
          type: 'link',
          attributes: {
            rel: 'stylesheet',
            href: '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
            id: emBookmarklet.faStylesheetId
          },
          parentElement: document.body
        },
        yardstick: {
          type: 'div',
          attributes: {
            id: emBookmarklet.yardstickID,
            style: {
              width: '1em',
              height: '1em',
              display: 'inline',
              position: 'absolute',
              left: '-9999px'
            }
          },
          parentElement: document.body
        },
        container: {
          type: 'div',
          attributes: {
            id: emBookmarklet.containerID
          },
          parentElement: document.body
        },
        anchor: {
          type: 'a',
          attributes: {
            id: emBookmarklet.closeIconId,
            href: '#',
            title: 'Close'
          },
          parentElement: emBookmarklet.containerID
        },
        icon: {
          type: 'i',
          attributes: {
            class: 'fa fa-times'
          },
          parentElement: emBookmarklet.closeIconId
        },
        display: {
          type: 'p',
          attributes: {
            id: emBookmarklet.displayID
          },
          parentElement: emBookmarklet.containerID
        },
        emspan: {
          type: 'span',
          attributes: {
            id: emBookmarklet.emid
          },
          parentElement: emBookmarklet.displayID
        },
        pxspan: {
          type: 'span',
          attributes: {
            id: emBookmarklet.pxid
          },
          parentElement: emBookmarklet.displayID
        }
      };

      for (var element in elements) {
        if (elements.hasOwnProperty(element)) {
          var parent = '',
              DOMelement = emBookmarklet.buildElement(elements[element].type, elements[element].attributes);
          if (elements[element].parentElement == document.body) {
            elements[element].parentElement.appendChild(DOMelement);
          }
          else {
            parent = document.getElementById(elements[element].parentElement);
            parent.appendChild(DOMelement);
          }
        }
      }
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
      emBookmarklet.createElements();
      emBookmarklet.updateMeasurements();
      emBookmarklet.addListeners(window, 'resize', emBookmarklet.updateMeasurements);
      emBookmarklet.addListeners(emBookmarklet.closeIconId, 'click', emBookmarklet.deleteElements);
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
