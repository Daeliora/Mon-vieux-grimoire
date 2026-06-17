const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  userId: String,
  grade: Number
});

const bookSchema = mongoose.Schema({
  userId: String,
  title: String,
  author: String,
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [ratingSchema],
  averageRating: Number
});

module.exports = mongoose.model('Book', bookSchema);