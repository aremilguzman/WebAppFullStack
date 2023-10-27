const { Router } = require("express");
const router = Router();
const cloudinary = require("cloudinary").v2;

//config para enlazar cloudinary con el servidor
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Photo = require("../models/Photo");
const fs = require("fs-extra");
const {isAuthenticated} = require('../authenticator/validate-auth');

//ruta para reenderizar las vistas de las fotos en evento, toma las fotos de la base de datos
router.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.render("images", { photos });
});

//ruta para mostrar formulario de subir imagenes
router.get("/images/add", isAuthenticated, async (req, res) => {
  const photos = await Photo.find();
  res.render("image_form", { photos });
});

//ruta para manejar la carga de imagenes a claudinary desde el formulario
router.post("/images/add", isAuthenticated, async (req, res) => {
  const { tittle, description } = req.body;
  console.log(req.file);
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newPhoto = new Photo({
      tittle,
      description,
      imageURL: result.url,
      public_id: result.public_id,
    });
    await newPhoto.save();
    await fs.unlink(req.file.path);
  } catch (error) {
    console.error("Error al cargar a Cloudinary:", error);
  }
  res.redirect("/");
});

//ruta para eliminar imagenes desde el formulario
router.get("/images/delete/:photo_id", isAuthenticated, async (req, res) => {
  try {
    const { photo_id } = req.params;
    const photo = await Photo.findByIdAndRemove(photo_id);
    const result = await cloudinary.uploader.destroy(photo.public_id);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/images/add");
});

module.exports = router;
