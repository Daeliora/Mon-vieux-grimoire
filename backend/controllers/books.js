exports.getAllBooks = (req, res, next) => {
  res.status(200).json({
    message: 'Liste des livres'
  });
};

exports.getOneBook = (req, res, next) => {
  res.status(200).json({
    message: 'Un livre'
  });
};

exports.createBook = (req, res, next) => {
  res.status(201).json({
    message: 'Livre créé'
  });
};

exports.modifyBook = (req, res, next) => {
  res.status(200).json({
    message: 'Livre modifié'
  });
};

exports.deleteBook = (req, res, next) => {
  res.status(200).json({
    message: 'Livre supprimé'
  });
};