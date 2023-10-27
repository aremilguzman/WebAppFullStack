const validate = {};

//funcion para proteger las rutas
validate.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "No estas autorizado");
  res.redirect("/users/signin");
};

module.exports = validate;
