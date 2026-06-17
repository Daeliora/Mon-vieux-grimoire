exports.signup = (req, res, next) => {
  res.status(200).json({
    message: 'Signup OK'
  });
};

exports.login = (req, res, next) => {
  res.status(200).json({
    message: 'Login OK'
  });
};