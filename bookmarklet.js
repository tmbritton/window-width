(function() {
  'use strict';
  var emBookmarklet = {
    //Properties
    containerID: 'tmbritton-embookmarklet',
    displayID: 'emdisplay',
    cssUrl: 'bookmarklet.css',
    emid: 'ems',
    pxid: 'pixels',
    yardstickID: 'tmbritton-embookmarkletyardstick',
    closeIconId: 'tmbritton-embookmarklet-close',
    stylesheetId: 'tmbritton-embookmarklet-css',
    faStylesheetId: 'tmbritton-embookmarklet-fa-css',

    //Methods
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

    constructDisplay: function() {
      var display = document.createElement('p');
      display.setAttribute('id', emBookmarklet.displayID);
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.emid));
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.pxid));
      return display;
    },

    constructFaStyles: function() {
      //fa_styles = '<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">';
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

    constructSpans: function(id) {
      var span = document.createElement('span');
      span.setAttribute('id', id);
      return span;
    },

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

    getWidthEms: function() {
      var yardstick = document.getElementById(emBookmarklet.yardstickID),
          emWidth = yardstick.offsetWidth,
          windowWidth = emBookmarklet.getWidthPixels(),
          totalEms = windowWidth / emWidth;
      return Math.round(totalEms);
    },

    getWidthPixels: function() {
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

    init: function() {
      var closeButton = document.getElementById(emBookmarklet.closeIconId);
      emBookmarklet.createYardstick();
      emBookmarklet.createPanel();
      emBookmarklet.updateMeasurements();
      emBookmarklet.addListeners(window, 'resize', emBookmarklet.updateMeasurements);
    },

    setEmDisplay: function(number) {
      var text = number + 'em',
          span = document.getElementById(emBookmarklet.emid);
      span.innerHTML = text;
    },

    setPixelDisplay: function(number) {
      var text = number + 'px',
          span = document.getElementById(emBookmarklet.pxid);
      span.innerHTML = text;
    },

    updateMeasurements: function() {
      var pxWidth = emBookmarklet.getWidthPixels(),
          emWidth = emBookmarklet.getWidthEms();
      emBookmarklet.setPixelDisplay(pxWidth);
      emBookmarklet.setEmDisplay(emWidth);
    },
  };
  emBookmarklet.init();
})();
