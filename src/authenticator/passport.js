const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user.model");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      //Verificacion y match de correo registrado
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Usuario no existe" });
      } else {
        //Verificacion y match de password registrado
        const match = await user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Contraseña incorrecta" });
        }
      }
    }
  )
);

//Metodo para serializar al usuario y almacenar su identificador único en una cookie de sesión.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Metodo para recuperar la información completa del usuario en mongoDB mediante el identificador U asignado
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
