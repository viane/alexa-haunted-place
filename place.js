'use strict';
// app/models/QuestionAnswerPair.js
// user for admin upload questions from either single submission or file submission

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var placeSchema = new Schema({
    name: String,
    description: String,
    media_links: String,
    coordinates: Array,
    state: String,
    source: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);