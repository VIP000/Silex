//////////////////////////////////////////////////
// Silex, live web creation
// http://projects.silexlabs.org/?/silex/
//
// Copyright (c) 2012 Silex Labs
// http://www.silexlabs.org/
//
// Silex is available under the GPL license
// http://www.silexlabs.org/silex/silex-licensing/
//////////////////////////////////////////////////

/**
 * @fileoverview Helper class for common tasks
 *
 */


goog.provide('silex.utils.Dom');

/**
 * @constructor
 * @struct
 */
silex.utils.Dom = function() {
  throw('this is a static class and it canot be instanciated');
}

/**
 * refresh an image
 */
silex.utils.Dom.refreshImage = function(img, cbk) {
  var initialUrl = img.src;
  img.onload = function(e) {
    // stop the process
    img.onload = null;
    // setTimeout(function (){
      // restore url
      // img.src = initialUrl;
      // done
      cbk();
    // }, 5000);
  };
  img.src = silex.utils.Dom.addCacheControl(initialUrl);
}


/**
 * name of the get param used to store the timestamp (cache control)
 * @constant
 */
silex.utils.Dom.CACHE_CONTROL_PARAM_NAME = 'silex-cache-control';


/**
 * add cache control to an URL
 * handle the cases where there is a ? or & or an existing cache control
 * @example silex.utils.Dom.addCacheControl('aaaaaaaa.com') returns 'aaaaaaaa.com?silex-cache-control=09238734099890'
 */
silex.utils.Dom.addCacheControl = function(url) {
  // remove existing cache control if any
  url = silex.utils.Dom.removeCacheControl(url);
  // add an url separator
  if (url.indexOf('?')>0){
    url += '&';
  }
  else{
    url += '?';
  }
  // add the timestamp
  url += silex.utils.Dom.CACHE_CONTROL_PARAM_NAME + '=' + Date.now();
  // return the new url
  return url;
}


/**
 * remove cache control from an URL
 * handle the cases where there are other params in get
 * works fine when url contains several URLs with cache control or other text (like a full image tag with src='')
 * @example silex.utils.Dom.addCacheControl('aaaaaaaa.com?silex-cache-control=09238734099890') returns 'aaaaaaaa.com'
 */
silex.utils.Dom.removeCacheControl = function(url) {
  // only when there is an existing cache control
  if (url.indexOf(silex.utils.Dom.CACHE_CONTROL_PARAM_NAME)>0){
    var re = new RegExp('([\?|&|&amp;]' + silex.utils.Dom.CACHE_CONTROL_PARAM_NAME + '=[0-9]*[&*]?)', 'gi');
    url = url.replace(re, function(match, group1, group2) {
      // if there is a ? or & then return ?
      // aaaaaaaa.com?silex-cache-control=09238734&ccsqcqsc&
      // aaaaaaaa.com?silex-cache-control=09238734099890
      // aaaaaaaa.com?silex-cache-control=09238734&ccsqcqsc&
      // aaaaaaaa.com?xxx&silex-cache-control=09238734&ccsqcqsc&
      if (group1.charAt(0) === '?' && group1.charAt(group1.length - 1) === '&'){
        return '?';
      }
      else if (group1.charAt(group1.length - 1) === '&' || group1.charAt(0) === '&'){
        return '&';
      }
      else {
        return '';
      }
    });
  }
  // return the new url
  return url;
}


/**
 * render a template by duplicating the itemTemplateString and inserting the data in it
 * @param {string} itemTemplateString   the template containing \{\{markers\}\}
 * @param {Array<string>}  data                 the array of strings conaining the data
 * @return {string} the template string with the data in it
 */
silex.utils.Dom.renderList = function (itemTemplateString, data) {
  var res = '';
  // for each item in data, e.g. each page in the list
  for (itemIdx in data){
    // build an item
    var item = itemTemplateString;
    // replace each key by its value
    for (key in data[itemIdx]){
      var value = data[itemIdx][key];
      item = item.replace(new RegExp('{{'+key+'}}', 'g'), value);
    }
    // add the item to the rendered template
    res += item;
  }
  return res;
}

/**
 * compute the bounding box of the given elements
 * use only element.style.* to compute this, not the real positions and sizes
 * so it takes into account only the elements which have top, left, width and height set in px
 * @return the bounding box containing all the elements
 */
silex.utils.Dom.getBoundingBox = function (elements) {
  // compute the positions and sizes
  var top = NaN,
      left = NaN,
      right = NaN,
      bottom = NaN;

  goog.array.forEach(elements, function (element) {
    // commpute the values, which may end up to be NaN or a number
    var elementTop = parseFloat(element.style.top.substr(0, element.style.top.indexOf('px')));
    var elementLeft = parseFloat(element.style.left.substr(0, element.style.left.indexOf('px')));
    var elementRight = (elementLeft || 0) + parseFloat(element.style.width.substr(0, element.style.width.indexOf('px')));
    var elementBottom = (elementTop || 0) + parseFloat(element.style.height.substr(0, element.style.height.indexOf('px')));
    // take the smallest top and left
    top = isNaN(top) ? elementTop : Math.min(top, elementTop);
    left = isNaN(left) ? elementLeft : Math.min(left, elementLeft);
    // take the bigger bottom and rigth
    bottom = isNaN(bottom) ? elementBottom : Math.max(bottom, elementBottom);
    right = isNaN(right) ? elementRight : Math.max(right, elementRight);
  }, this);

  var res = {};
  // top left
  if (!isNaN(top)) res.top = top;
  if (!isNaN(left)) res.left = left;
  // bottom right
  if (isNaN(top)) top = 0;
  if (isNaN(left)) left = 0;
  if (!isNaN(bottom)) res.height = bottom - top;
  if (!isNaN(right)) res.width = right - left;
  return res;
}
