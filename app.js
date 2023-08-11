// libraries

require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const SerchNotices = require(`${__dirname}/models/serch-noticias`)
const cors = require('cors');
const router = express.Router();
const multer = require('multer');
const https = require('https');

const cookieParser = require('cookie-parser');

// config webpage
const index = fs.readFileSync(`${__dirname}/template/index.html`, 'utf-8');
const cardsNotice = fs.readFileSync(`${__dirname}/template/cards-notice.html`, 'utf-8');

// models
const ReplaceData = require(`${__dirname}/models/replace`);


  
  // config libraries
app.use(express.static('public'));
app.use(express.json());
app.use(bodyparser.urlencoded( {extended : true} ));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());
app.use(multer().none());


const conn = require(`${__dirname}/models/conn`);
conn();

// cron.schedule('* */2 * * *', () => {
//   SerchNotices();
// });

router.post('/configurar-cookies', (req, res) => {
  let { aceitarCookies } = req.body;

  if (aceitarCookies === 'true') {
    res.cookie('aceitarCookies', 'true', { maxAge: 20000 });
  } else {
    res.clearCookie('aceitarCookies');
    // res.cookie('aceitarCookies', 'false', { maxAge: 20000 });
  }

  res.redirect('/');
});




// main page
router.get('/', function(req, res) {
  // read notices
  let Noticias = fs.readFileSync(`${__dirname}/data/noticias.json`);
  let NoticiasJSON = JSON.parse(Noticias);
  
  // replace data
  let replaceCards = NoticiasJSON.map(el => ReplaceData(cardsNotice, el)).join('');

  let output = index.replace('{%NOTICES%}', replaceCards);
  
  let aceitaCookies = req.cookies.aceitarCookies === 'true';
  const outputWithCookieInfo = output.replace('{%ACEITA_COOKIES%}', aceitaCookies ? 'Sim' : 'Não');
  console.log(req.cookies);
  res.send(outputWithCookieInfo);
});

const email2 = require(`${__dirname}/models/email`);
// send email page


router.post('/cadastro', async function(req, res) {
  // var emailEnviado
  try {
    // const nome = req.body.nome;
    // const email = req.body.email;

    // console.log('Nome:', nome);
    // console.log('Email:', email);


    await email2(req, res);


    res.json({ status: 'success', emailEnviado: true });
  
  } catch (erro) {

    // emailEnviado = false;
    res.json({ status: 'error', emailEnviado: false });
  }
  
});

app.use('/', router);

const options = {
  key: fs.readFileSync(`${__dirname}/lets/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/lets/cert.pem`)
};

const server = https.createServer(options, app);

server.listen((process.env.PORT_APP || 3000), () => {
    console.log('server on');
});