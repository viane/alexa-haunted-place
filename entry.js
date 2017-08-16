'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _place = require('./place');

var _place2 = _interopRequireDefault(_place);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Alexa = require('alexa-sdk');
var mongoose = require('mongoose');


mongoose.connect("mongodb://xiaoyuzhou:Zsbqwacc0@ds031948.mlab.com:31948/haunted_place");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// myNodeProject.uploadPlaceByJSON('./place.json');
// myNodeProject.uploadPlaceByJSON('./place2.json');

var APP_ID = "amzn1.ask.skill.2a9995bc-cc14-4b01-b831-1cf1ad721375";

var HELP_MESSAGE = "You can say I want to find a haunted place in new york? or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var states = {
  "inputState": "start_question"
};

var handlers = {
  'LaunchRequest': function LaunchRequest() {
    this.emit('invokeNewAsk');
  },
  'invokeNewAsk': function invokeNewAsk() {
    var _this = this;

    var speechOutput = "";
    if (this.event.request.intent.slots.state.hasOwnProperty('value')) {
      var searchState = toTitleCase(this.event.request.intent.slots.state.value);
      searchStateHP(searchState).then(function (HPObj) {
        if (HPObj.result) {
          speechOutput = "Here is the place: " + HPObj.name + " <break time=\"2s\"/> a short introduction of this place: " + HPObj.value;
        } else {
          speechOutput = "Sorry I can't find any haunted place in this state.";
        }
        _this.emit(':tell', speechOutput);
      });
    } else {
      speechOutput = "I didn't get which state you are asking with, please try again with including the state name";
      this.emit(':tell', speechOutput);
    }
  },
  'AMAZON.HelpIntent': function AMAZONHelpIntent() {
    var speechOutput = HELP_MESSAGE;
    var reprompt = HELP_REPROMPT;
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function AMAZONCancelIntent() {
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function AMAZONStopIntent() {
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function Unhandled() {
    this.emit(':ask', 'Sorry, I didn\'t get that.');
  }
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

var searchStateHP = function searchStateHP(state) {
  return new Promise(function (resolve, reject) {
    _place2.default.find({
      state: state
    }, function (err, docs) {
      if (err) {
        console.error(err);
        return resolve({ result: false });
      }
      if (docs.length === 0) {
        console.error('No record found');
        return resolve({ result: false });
      }
      var index = Math.floor(Math.random() * docs.length);
      console.log(index);
      var returnObj = { result: true, name: docs[index].name, value: docs[index].description };
      resolve(returnObj);
    });
  });
};

// searchStateHP("New York").then(result=>{
//   console.log(result);
// });