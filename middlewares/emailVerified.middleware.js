const checkEmailVerified = (req, res, next) => {
  const { user } = req;
  if (user.emailVerified) {
    return next();
  }
  return res.status(401).send({
    error: "Your email is not verified. Please verify your email you continue using our service.",
  });
}

module.exports = checkEmailVerified;