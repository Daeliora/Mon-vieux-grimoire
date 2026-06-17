const Book = require('../models/Book');
const fs = require('fs');

const sharp = require('sharp');
const path = require('path');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

//
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ error });
    });
};

//
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const filename = req.file.filename.split('.')[0];
// convertir l'image en webp et la redimensionner
  sharp(req.file.path)
    .resize(800)
    .webp({ quality: 80 })
    .toFile(`images/${filename}.webp`)
    .then(() => {

    fs.unlink(req.file.path, () => {

      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}.webp`
      });

      book.save()
        .then(() => {res.status(201).json({message: 'Livre enregistré !'})})
        .catch(error => {res.status(400).json({ error })});
    });
  })
  .catch(error => {res.status(500).json({ error })});
};  

//
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({message: 'Not authorized'});
      }

      // Nouvelle image envoyée
      if (req.file) {

        const oldFilename = book.imageUrl.split('/images/')[1];

        fs.unlink(`images/${oldFilename}`, (err) => {

          if (err) {console.log(err)}
          const newFilename = req.file.filename.split('.')[0];
// convertir l'image en webp et la redimensionner
          sharp(req.file.path)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(`images/${newFilename}.webp`)
            .then(() => {fs.unlink(req.file.path, () => {
              Book.updateOne(
                { _id: req.params.id },
                {
                 ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${newFilename}.webp`,
                  _id: req.params.id
                }
              )
                .then(() => {res.status(200).json({message: 'Livre modifié !'})})
                .catch(error => {res.status(401).json({ error })});
              });
            })
            .catch(error => {res.status(500).json({ error })});
      });
      } else {
        // Pas de nouvelle image
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({message: 'Livre modifié !'}))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {res.status(400).json({ error })});
};

//
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];

        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé !' });
            })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      const alreadyRated = book.ratings.find(rating => rating.userId === req.auth.userId);

      if (alreadyRated) {
        return res.status(400).json({message: 'Livre déjà noté'});
      }

      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating
      });

      const total = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );

      book.averageRating = total / book.ratings.length;

      book.save()
        .then(updatedBook => {res.status(200).json(updatedBook)})
        .catch(error => {res.status(400).json({ error })});
    })
    .catch(error => {res.status(404).json({ error })});
};