const mongoose = require('mongoose');
const DBuser = process.env.DB_USER;
const DBpasswd = process.env.DB_PASSWD;
const url = (`mongodb+srv://${DBuser}:${DBpasswd}@contatoforms.lfj5piu.mongodb.net/?retryWrites=true&w=majority`)

async function main() {

    try {
        
        await mongoose.connect(url);
        console.log('conectado no banco');

    } catch (error) {

        console.log('Não foi possível conectar no banco: '+error)
    }
}

module.exports = main;