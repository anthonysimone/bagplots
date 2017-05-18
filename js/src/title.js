!function ($) {
  "use strict";

  var colors = ['#B76895', '#FB4700', '#A45ECB', '#231FE8', '#3A9874', '#92EC37', '#FFED2C', '#FFCA2C'];
  var currentColor;
  var $colorText = $('.color-text');

  function testColor(color1, color2) {
    return (color1 === color2);
  }

  function getColor() {
    var color = colors[Math.floor(Math.random() * colors.length)];
    return (testColor(currentColor, color)) ? getColor() : currentColor = color;
  }

  setInterval(function () {
    $colorText.css('color', getColor);
  }, 3000);

}(jQuery);