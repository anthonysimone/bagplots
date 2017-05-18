!function ($) {
  "use strict";

  let $bag = $('<span class="go-bags-bag">').text('Bags!'),
      $sarah = $('.sarah-headshot-wrapper'),
      $body = $('body');

  $sarah.on({
    "mouseenter": function() {
      $body.addClass('bags-on');
      activateBags();
    },
    "mouseleave": function() {
      $body.removeClass('bags-on');
      stopBags();
    }
  });



  let bagTimeout,
      i = 0;
  function activateBags() {
    i++;
    let timeTilBag = getRandomNumber(250, 1200 - incrementValue(i));
    generateBag($bag, 2000);
    bagTimeout = setTimeout(function() {
      generateBag($bag, 1400);
      activateBags();
    }, timeTilBag);
  }
  function stopBags() {
    clearTimeout(bagTimeout);
    $('.go-bags-bag').remove();
    i = 0;
  }



  // Bag helper functions
  function getRandomPosition() {
    let top = Math.floor(Math.random() * window.innerHeight),
        left = Math.floor(Math.random() * window.innerWidth);

    return {top: top + 'px', left: left + 'px'}
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function generateBag(bag, lifetime) {
    let $thisBag = bag.clone();
    $('.page-wrap').append($thisBag
      .css(getRandomPosition())
      .addClass(`bag-color-${getRandomNumber(1, 7)} bag-font-${getRandomNumber(1, 6)} bag-size-${getRandomNumber(1, 7)} bag-style-${getRandomNumber(1, 6)}`));

    setTimeout(function() {
      $thisBag.remove();
    }, lifetime);
  }

  function incrementValue(i) {
    return (i * 100 > 1000) ? 1000 : i * 100;
  }

}(jQuery);