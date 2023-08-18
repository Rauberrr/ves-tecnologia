const nodemailer = require('nodemailer');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWD, {
    host: 'mysql.ves.tec.br',
    dialect: 'mysql'
});

const forms = sequelize.define('forms', {
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    telefone: {
        type: Sequelize.STRING
    },
    empresa: {
        type: Sequelize.STRING
    },
    mensagem: {
        type: Sequelize.STRING
    }
});

// Sincronize as tabelas apenas uma vez, quando a aplicação for iniciada
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Successful connection to the database');

        // Remova o { force: true } para evitar a recriação da tabela
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.log('Failed to connect or sync the database:', error);
    }
})();

async function main(req, res) {

        const data = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            empresa: req.body.empresa,
            mensagem: req.body.mensagem
        }

        const testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {

            if(data.email && testEmail.test(data.email)) {
                
                await forms.create(data);
                console.log(data.nome);
                console.log(data.email);
                
                const servico_email = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'andrerauber2006@gmail.com',
                        pass: 'xzsymjndgnyxxiyb'
                    }
                });
                
            let info_email = {
                from: 'andrerauber2006@gmail.com',
                to: req.body.email,
                subject: req.body.empresa,
                text: req.body.mensagem
            };
        
        let info = await servico_email.sendMail(info_email);
        console.log('Email enviado: ' + info.response);
            res.json({ status: 'success', emailEnviado: true });
        } else {
        console.log('email nao definido');
            res.json({ status: 'error', emailEnviado: false });
        }
        }catch (erro) {
            console.log('falha ao enviar o email');
            res.json({ status: 'error', emailEnviado: false });
        }
        
}

module.exports = main;