'use strict';

angular.module('ratefastApp')
  .controller('MainCtrl', function ($timeout) {
      //reload the twitter widget
      var $ = function (id) { return document.getElementById(id); };
      function loadTwitter() { !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs"); }

      var twitter = $('twitter-wjs');
      //twitter.remove();
      twitter.parentNode.removeChild(twitter); //Device compaitibility for IE browser
      loadTwitter();
  });