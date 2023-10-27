const {Schema, model} = require('mongoose');

//esquema de datos para interactuar con mongoDB
const Photo = new Schema ({
    tittle: String,
    description: String,
    imageURL: String,
    public_id: String
});

module.exports = model('Photo', Photo);