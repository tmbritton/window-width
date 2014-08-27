(function() {
  'use strict';
  var emBookmarklet = {
    //Properties
    containerID: 'tmbritton-embookmarklet',
    displayID: 'emdisplay',
    cssUrl: '//tmbritton.github.io/window-width/bookmarklet.css',
    emid: 'ems',
    pxid: 'pixels',
    yardstickID: 'tmbritton-embookmarkletyardstick',

    //Methods
    addListeners: function() {
      if(window.attachEvent) {
        window.attachEvent('onresize', function() {
          emBookmarklet.updateMeasurements();
        });
      }
      else if(window.addEventListener) {
        window.addEventListener('resize', function() {
          emBookmarklet.updateMeasurements();
        }, true);
      }
      else {
        console.log('This browser does not support Javascript event binding');
      }
    },

    constructContainer: function() {
      var container = document.createElement('div');
      container.setAttribute('id', emBookmarklet.containerID);
      return container;
    },

    constructDisplay: function() {
      var display = document.createElement('p');
      display.setAttribute('id', emBookmarklet.displayID);
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.emid));
      display.appendChild(emBookmarklet.constructSpans(emBookmarklet.pxid));
      return display;
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
            ['media', 'screen']
          ];
      attributes.forEach(function(element) {
        styles.setAttribute(element[0], element[1]);
      });
      return styles;
    },

    createPanel: function() {
      var container = emBookmarklet.constructContainer(),
          display = emBookmarklet.constructDisplay(),
          styles = emBookmarklet.constructStyles();
      container.appendChild(display);
      document.body.appendChild(container);
      document.body.appendChild(styles);
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
      emBookmarklet.createYardstick();
      emBookmarklet.createPanel();
      emBookmarklet.updateMeasurements();
      emBookmarklet.addListeners();
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
