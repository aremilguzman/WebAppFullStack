const usersControl = {};

const passport = require("passport");

const User = require("../models/user.model");

//reenderizar la vista del registro
usersControl.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

//procesar los datos del formulario de registro, se valida y se completa el registro
usersControl.signup = async (req, res) => {
  const errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden" });
  }
  if (password.length < 8) {
    errors.push({ text: "La contraseña debe contener al menos 8 caracteres" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
    });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "Este email ya esta en uso.");
      res.redirect("/users/signup");
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      res.redirect("/users/signin");
    }
  }
};

//reenderizar la vista de inicar sesion
usersControl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

//autenticar los usuarios
usersControl.signin = passport.authenticate("local", {
  failureRedirect: "/users/signin",
  successRedirect: "/",
  failureFlash: true,
});

//cerrar sesion
usersControl.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Has cerrado sesión");
    res.redirect("/");
  });
};

module.exports = usersControl;
