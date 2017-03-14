'use strict';

var palette = document.getElementById('palette');

function hex2rgb(hex) {
  if (hex[0] === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 6) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  } else if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16)
    };
  }
}

function rgb2hex(r, g, b) {
  function _convert(num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  return [_convert(r), _convert(g), _convert(b)].join('');
}

function rgb2hsv(r, g, b) {
  var h, s, v;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var delta = max - min;

  // hue
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  // saturation
  s = Math.round((max === 0 ? 0 : delta / max) * 100);

  // value
  v = Math.round(max / 255 * 100);

  return {
    h: h,
    s: s,
    v: v
  };
};

function hsv2hsl(h, s, v) {
  var hh = (200 - s) * v / 100;

  return {
    h: h,
    s: s * v / (hh < 100 ? hh : 200 - hh),
    l: hh / 2
  };
};

function hex2hsl(hex) {
  var rgb = hex2rgb(hex);
  var hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
  var hsl = hsv2hsl(hsv.h, hsv.s, hsv.v);
  return hsl;
}

function normalizeColor(color) {
  var rgb = hex2rgb(color.replace(/\s/g, ''));
  if (!rgb) {
    return null;
  }
  return '#' + rgb2hex(rgb.r, rgb.g, rgb.b);
}

function setColor(input, hex) {
  var hsl = undefined;
  var isLight = undefined;
  try {
    hsl = hex2hsl(hex);
    isLight = hsl.l > 74;
  } catch (e) {
    hex = '#000000';
    isLight = false;
  }

  input.style = ['background-color: ' + hex + ';', 'color: ' + (isLight ? '#000000' : '#ffffff') + ';'].join(' ');
}

function createInput() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? '#' : arguments[0];
  var parentElement = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  var insertBefore = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var focus = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  var input = document.createElement('input');
  input.className = 'swatch';
  input.value = value;
  input.autocomplete = 'off';
  input.autocorrect = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  if (parentElement) {
    if (insertBefore) {
      parentElement.insertBefore(input, insertBefore);
    } else {
      parentElement.appendChild(input);
    }
  }
  activateInput(input, focus);
  return input;
}

function activateInput(input) {
  var focus = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  input.addEventListener('keydown', function (event) {
    if (event.which === 13) {
      var newInput = createInput('#', input.parentElement, input.nextElementSibling, true);
    } else if (event.which === 8) {
      if (input.value === '' && palette.childElementCount > 1) {
        var nextFocus = input.previousElementSibling || input.nextElementSibling;
        var nextSelect = input.previousElementSibling ? nextFocus.value.length : 0;
        if (nextFocus) {
          nextFocus.focus();
          nextFocus.setSelectionRange(nextSelect, nextSelect);
        }
        input.remove();
        event.preventDefault();
      }
    } else if (event.which === 46) {
      if (input.value === '' && palette.childElementCount > 1) {
        var nextFocus = input.nextElementSibling || input.previousElementSibling;
        var nextSelect = input.nextElementSibling ? 0 : nextFocus.value.length;
        if (nextFocus) {
          nextFocus.focus();
          nextFocus.setSelectionRange(nextSelect, nextSelect);
        }
        input.remove();
        event.preventDefault();
      }
    } else if ([9, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(event.which) >= 0) {
      // cool
    } else if (event.key === 'v' && event.metaKey) {
        // pasting
      } else if (!event.key.match(/^[#a-f0-9]$/i)) {
          event.preventDefault();
        }
  });

  input.addEventListener('input', function () {
    setColor(input, normalizeColor(input.value));
  });

  setColor(input, input.value);

  if (focus) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  input.addEventListener('paste', function (event) {
    var text = event.clipboardData.getData('text');
    var colors = text.split(/[,\s]/g).filter(function (v) {
      return v;
    });
    if (colors.length > 1) {
      (function () {
        var lastInput = input;
        colors.forEach(function (color) {
          lastInput = createInput(color, palette, lastInput.nextElementSibling, true);
        });
        event.preventDefault();
      })();
    }
  });
}

['#EA282E', '#EF6946', '#FDCF1A', '#4FBA49', '#01A7EE', '#12E'].forEach(function (color) {
  createInput(color, palette, null, true);
});

document.body.addEventListener('click', function (event) {
  if (event.target === document.body) {
    var input = document.querySelector('input:last-child');
    input.focus();
  }
});