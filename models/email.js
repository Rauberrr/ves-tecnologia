const ContatoForms = require(`${__dirname}/ContatoForms`)
const nodemailer = require('nodemailer');

async function findEmail (req, res) {
    await ContatoForms.create({
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        empresa: req.body.empresa,
        menssagem: req.body.menssagem
      });
  
        const data = await ContatoForms.find({});
        const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
        const lastData = sortedData[0];

        var nome = lastData.nome
        var email = lastData.email
        var telefone = lastData.telefone
        var empresa = lastData.empresa
        var menssagem = lastData.menssagem
        console.log(email)

    const servico_email = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'andrerauber2006@gmail.com',
            pass: 'xzsymjndgnyxxiyb'
        }
      });

    let info_email = {
        from: 'andrerauber2006@gmail.com',
        to: email,
        subject: empresa,
        text: menssagem
    };

    let info = await servico_email.sendMail(info_email);
    console.log('Email enviado: ' + info.response);
    // res.redirect('/');
}

module.exports = findEmail;