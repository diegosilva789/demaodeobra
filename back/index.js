require('dotenv').config()
const db = require("./db");
var cors = require('cors');
var express = require('express');
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const fileUpload = require('express-fileupload');

// instância o express
var app = express();

// para conversão de application/json
app.use(express.json());

// para conversão de application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// para aceitar requisição de outros domínios
app.use(cors({
  origin: process.env.DOMAIN
}));
// app.use(cors({
//   credentials: false,
//   origin: 'http://localhost:3100'
// }));

app.use(fileUpload());

// define a porta e a função callback a ser executada após o servidor iniciar
const port = process.env.PORT || 3101;
app.listen(port, () => {
  console.log(`Rodando na porta ${port}...`);
});

function verificarJWT(req, res, next) {
  const token = req.headers.authorization
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).end()
    req.usu_id = decoded.usu_id
    next();
  })
}

// rotas públicas

// http://localhost:3101/
app.get('/', async (request, response) => {
  response.send({ info: 'Node.js, Express e Postgres API' })
})

// http://localhost:3101/login
app.post('/login', (request, response) => {
  const req = request.body
  var sql = 'select * from usuario where usu_email=$1 and usu_senha=$2'
  var values = [req.usu_email, req.usu_senha];
  db.pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json("Usuário não autorizado, contate o administrador.")
    } else {
      if (results.rows.length > 0 && results.rows[0].usu_pendente === 1) {
        response.status(401).end("Conta não ativada, verifique seu e-mail.")
      } else if (results.rows.length > 0 && results.rows[0].usu_email === req.usu_email && results.rows[0].usu_senha === req.usu_senha &&
        results.rows[0].usu_pendente === 0) {
        const token = jwt.sign({ usu_id: results.rows[0].usu_id }, SECRET, { expiresIn: 864000 })
        console.log("Encontrado:", results.rows.length, "usuário com o login atual")
        response.status(200).json({ auth: true, token: token })
      } else {
        response.status(401).end("Usuário inexistente, registre-se antes de prosseguir.")
      }
    }
  })
})

// http://localhost:3101/obterAnuncios
app.get('/obterAnuncios', db.obterAnuncios)

// http://localhost:3101/obterAnunciosPorCat_id
app.post('/obterAnunciosPorCat_id', db.obterAnunciosPorCat_id)

// http://localhost:3101/obterAnunciosPorAnu_uf
app.post('/obterAnunciosPorAnu_uf', db.obterAnunciosPorAnu_uf)

// http://localhost:3101/obterAnunciosPorAnu_id
app.post('/obterAnunciosPorAnu_id', db.obterAnunciosPorAnu_id)

// http://localhost:3101/obterAnunciosPorAnu_cidade
app.post('/obterAnunciosPorAnu_cidade', db.obterAnunciosPorAnu_cidade)

// http://localhost:3101/obterUsuarioPorUsu_email
app.post('/obterUsuarioPorUsu_email', db.obterUsuarioPorUsu_email)

// http://localhost:3101/obterCategorias
app.get('/obterCategorias', db.obterCategorias)

// http://localhost:3101/inserirUsuario
app.post('/inserirUsuario', db.inserirUsuario)

// http://localhost:3101/obterFotosAnuncios
app.get('/obterFotosAnuncios', db.obterFotosAnuncios)

// http://localhost:3101/obterFotosAnuncioPorAnu_id
app.post('/obterFotosAnuncioPorAnu_id', db.obterFotosAnuncioPorAnu_id)

// http://localhost:3101/obterAnunciosPorAnu_titulo
app.post('/obterAnunciosPorAnu_titulo', db.obterAnunciosPorAnu_titulo)

// http://localhost:3101/obterAnunciosPorAnu_tituloPorCat_id
app.post('/obterAnunciosPorAnu_tituloPorCat_id', db.obterAnunciosPorAnu_tituloPorCat_id)

// http://localhost:3101/obterAnunciosPorAnu_tituloPorAnu_uf
app.post('/obterAnunciosPorAnu_tituloPorAnu_uf', db.obterAnunciosPorAnu_tituloPorAnu_uf)

// http://localhost:3101/obterAnunciosPorAnu_tituloPorAnu_cidade
app.post('/obterAnunciosPorAnu_tituloPorAnu_cidade', db.obterAnunciosPorAnu_tituloPorAnu_cidade)

// rotas privadas

// http://localhost:3101/obterUsuarioPorUsu_id
app.post('/obterUsuarioPorUsu_id', verificarJWT, db.obterUsuarioPorUsu_id)

// http://localhost:3101/obterAnunciosPorUsu_id
app.post('/obterAnunciosPorUsu_id', verificarJWT, db.obterAnunciosPorUsu_id)

// http://localhost:3101/obterAnunciosPorUsu_id
app.post('/obterAnunciosPorUsu_id', verificarJWT, db.obterAnunciosPorUsu_id)

// http://localhost:3101/obterEnderecoPorUsu_id
app.post('/obterEnderecoPorUsu_id', verificarJWT, db.obterEnderecoPorUsu_id)

// http://localhost:3101/inserirAnuncio
app.post('/inserirAnuncio', verificarJWT, db.inserirAnuncio)

// http://localhost:3101/alterarUsuario
app.post('/alterarUsuario', verificarJWT, db.alterarUsuario)

// http://localhost:3101/alterarAnuncio
app.post('/alterarAnuncio', verificarJWT, db.alterarAnuncio)

// http://localhost:3101/deletarFotosAnuncio
app.post('/deletarFotosAnuncio', verificarJWT, db.deletarFotosAnuncio)

// http://localhost:3101/alterarEnderecoPorUsu_id
app.post('/alterarEnderecoPorUsu_id', verificarJWT, db.alterarEnderecoPorUsu_id)

// http://localhost:3101/inserirFotosAnuncio
app.post('/inserirFotosAnuncio', verificarJWT, db.inserirFotosAnuncio)

// http://localhost:3101/inserirMensagem
app.post('/inserirMensagem', verificarJWT, db.inserirMensagem)

// http://localhost:3101/obterMensagensPorUsu_id_men_enviada
app.post('/obterMensagensPorUsu_id_men_enviada', verificarJWT, db.obterMensagensPorUsu_id_men_enviada)

// http://localhost:3101/obterMensagensPorUsu_id_men_resposta
app.post('/obterMensagensPorUsu_id_men_resposta', verificarJWT, db.obterMensagensPorUsu_id_men_resposta)

// http://localhost:3101/deletarAnuncio
app.post('/deletarAnuncio', verificarJWT, db.deletarAnuncio)

// http://localhost:3101/alterarMensagem
app.post('/alterarMensagem', verificarJWT, db.alterarMensagem)

// http://localhost:3101/images
app.use('/images', express.static('./assets/images'));

// http://localhost:3101/remove
app.post('/remove', (request, response, next) => {
  var lista = request.body.lista;
  const fs = require('fs');
  const path = require('path');

  const directory = path.join(__dirname, 'assets/images');

  console.log(directory)

  fs.readdir(directory, (err, files) => {
    if (err) console.log(err);

    for (const file of files) {
      if (file !== 'default') {
        if (lista.includes(file)) {
          console.log("Mantendo:", file);
        }
        else {
          fs.unlinkSync(path.join(directory, file))
          // fs.unlink(path.join(directory, file), err => {
          //   if (err) console.log(err);
          // });
          console.log("Deletando:", file);
        }
      }
    }
  });
  response.status(200)
});

// http://localhost:3101/uploadFile
app.post('/uploadFile', function (req, res) {
  let filetoupload;
  let uploadPath;

  const crypto = require("crypto");

  const path = require('path');

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Nenhum arquivo foi enviado');
  }

  var nome = crypto.randomBytes(20).toString('hex');
  filetoupload = req.files.filetoupload;
  console.log("Recebendo:", filetoupload.name)
  nome = nome + path.extname(filetoupload.name);
  uploadPath = __dirname + '/assets/images/' + nome;

  filetoupload.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);

    console.log("Salvando como:", nome)
    res.send({ data: { name: nome, name_original: req.files.filetoupload.name } });
  });
});

app.get('/ativarUsuario/:email', (req, res) => {
  const { email } = req.params;
  var sql = 'update usuario set usu_pendente=0 where usu_email=$1 and usu_pendente=1 returning *'
  var values = [email];
  db.pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      res.status(422).send('O e-mail fornecido não pode ser ativado ou já foi ativado');
    } else {
      if (results.rows.length > 0) {
        res.status(200).json({ message: `O e-mail ${email} foi ativado com sucesso` })
      } else {
        res.status(422).send('O e-mail fornecido não pode ser ativado ou já foi ativado');
      }
    }
  })
})