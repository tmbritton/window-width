Window Width in ems Bookmarklet
-------------------------------

I was looking for a Chrome Plugin/Javascript bookmarklet that would display window width in ems.
I couldn't find one so I made this bookmarklet.

Drag the link below to your Bookmarks Toolbar.

<a href="javascript: (function () {
  var jsCode = document.createElement('script');
  jsCode.setAttribute('src', 'https://raw.githubusercontent.com/tmbritton/window-width/master/bookmarklet.js');
document.body.appendChild(jsCode);
}());">Window Width</a>
