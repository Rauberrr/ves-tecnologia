const mongoose = require('mongoose');

const ContatoForms = mongoose.model('ContatoForms', {
    nome: String,
    email: String,
    telefone: Number,
    empresa: String,
    menssagem: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = ContatoForms;