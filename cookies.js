// Importe o pacote cookie-parser
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

// ... (seu código existente)

// Configurar o uso do cookie-parser no aplicativo
app.use(cookieParser());

// Rota para definir a preferência do usuário em relação aos cookies
app.post('/configurar-cookies', (req, res) => {
  const { aceitarCookies } = req.body;

  // Verificar se o usuário escolheu aceitar os cookies obrigatórios
  if (aceitarCookies === 'true') {
    // Definir o cookie com um nome de 'aceitarCookies' e valor 'true'
    res.cookie('aceitarCookies', 'true', { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expira em 30 dias
  } else {
    // Caso o usuário tenha escolhido não aceitar os cookies, podemos removê-lo
    res.clearCookie('aceitarCookies');
  }

  // Redirecionar o usuário de volta para a página principal
  res.redirect('/');
});

// Rota para a página principal
app.get('/', (req, res) => {
  // Verificar se o cookie 'aceitarCookies' foi definido e se é igual a 'true'
  const aceitaCookies = req.cookies.aceitarCookies === 'true';

  // Renderizar a página principal com informações sobre a preferência de cookies do usuário
  const outputWithCookieInfo = output.replace('{%ACEITA_COOKIES%}', aceitaCookies ? 'Sim' : 'Não');
  res.send(outputWithCookieInfo);
});

// ... (seu código existente)

// Adicione as outras rotas do seu aplicativo após essa parte

app.listen(3000, () => {
  console.log('Servidor ativo na porta 3000');
});