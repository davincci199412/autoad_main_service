module.exports = validate => (req, res, next) => {
  const { errors, isValid } = validate(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(200).json(errors);
  }
  next();
};
