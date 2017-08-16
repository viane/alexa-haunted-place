'use strict';

var _alwaysTrue = require('./always-true');

var _alwaysTrue2 = _interopRequireDefault(_alwaysTrue);

var _place = require('./place');

var _place2 = _interopRequireDefault(_place);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadJsonFile = require('load-json-file');

var placeArray = [];
var item = 0;

exports.uploadPlaceByJSON = function (filePath) {
  loadJsonFile(filePath).then(function (json) {
    placeArray = json.features;
    uploadPlaceWithState('google');
  });
};

exports.alwaysTrue = function () {
  return (0, _alwaysTrue2.default)();
};

var uploadPlaceWithState = function uploadPlaceWithState(source) {
  setTimeout(function () {
    var place = placeArray[0];
    var placeDoc = new _place2.default();
    placeDoc.name = place.properties.Name;
    placeDoc.description = place.properties.description;
    if (place.properties.hasOwnProperty('gx_media_links')) {
      placeDoc.media_links = place.properties.gx_media_links;
    }
    placeDoc.coordinates = place.geometry.coordinates;
    if (place.properties.hasOwnProperty('state')) {
      placeDoc.state = place.properties.state;
    } else {
      placeDoc.state = null;
    }
    placeDoc.source = source;
    placeDoc.save(function (err, newDoc, numAffected) {
      if (err) {
        return console.error(err, 'Place: ', place.properties.Name);
      }
      placeArray.shift();
      console.log('Place: ', newDoc.name, ' has successfully uploaded.');
      if (placeArray.length > 0) {
        item++;
        return uploadPlaceWithState('google');
      } else {
        console.log(item, ' Task Done');
        item = 0;
        placeArray = [];
        return;
      }
    });
  }, 1000);
};