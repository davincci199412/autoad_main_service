module.exports = permission => (req, res, next) => {
  const user = req.user;

  // reject if user's permission is not allowed (important: user role has sequence number)
  console.log('user role --------> ', user.role);
  if (user && user.role > permission) {
    return res.status(200).json({
      success: false,
      msg: 'user permission denied',
    });
  }

  next();
};
