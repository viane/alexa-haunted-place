import alwaysTrue from './always-true';
import Place from './place'

const loadJsonFile = require('load-json-file');

let placeArray = [];
let item = 0;

exports.uploadPlaceByJSON = (filePath) => {
  loadJsonFile(filePath).then(json => {
    placeArray = json.features;
    uploadPlaceWithState('google');
  });
}

exports.alwaysTrue = () => {
  return alwaysTrue();
};

const uploadPlaceWithState = (source) => {
  setTimeout(function() {
    const place = placeArray[0];
    const placeDoc = new Place();
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
    placeDoc.save(function(err, newDoc, numAffected) {
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
}
