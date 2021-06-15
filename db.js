const mailer = require("./mailer");
const Pool = require('pg').Pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const obterCategorias = (request, response) => {
  pool.query('SELECT * FROM categoria ORDER BY cat_descricao ASC', (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "categorias")
      response.status(200).json(results.rows)
    }
  })
}

const obterFotosAnuncios = (request, response) => {
  pool.query('SELECT * FROM foto_anuncio', (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "fotos")
      response.status(200).json(results.rows)
    }
  })
}

const obterFotosAnuncioPorAnu_id = (request, response) => {
  const id = request.body
  const sql = 'SELECT * FROM foto_anuncio where anu_id=$1'
  pool.query(sql, [id.anu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "fotos do anúncio")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnuncios = (request, response) => {
  pool.query('SELECT * FROM anuncio order by anu_data_cadastro desc', (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorUsu_id = (request, response) => {
  const id = request
  const sql = 'SELECT * FROM anuncio where usu_id=$1 order by anu_data_cadastro desc'
  pool.query(sql, [id.usu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios do usuário")
      response.status(200).json(results.rows)
    }
  })
}

// mudar o nome
const obterAnunciosPorAnu_id = (request, response) => {
  const id = request.body
  const sql = 'SELECT * FROM anuncio a, usuario u where a.anu_id=$1 ' +
    'and a.usu_id = u.usu_id'
  pool.query(sql, [id.anu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncio com o ID")
      response.status(200).json(results.rows)
    }
  })
}

const obterUsuarioPorUsu_id = (request, response) => {
  const id = request
  const sql = 'select * from usuario where usu_id=$1 '
  pool.query(sql, [id.usu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "usuário com o ID")
      response.status(200).json(results.rows)
    }
  })
}

const obterEnderecoPorUsu_id = (request, response) => {
  const id = request
  const sql = 'select * from endereco where usu_id=$1'
  pool.query(sql, [id.usu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "endereço do usuário")
      response.status(200).json(results.rows)
    }
  })
}

const obterUsuarioPorUsu_email = (request, response) => {
  const req = request.body
  const sql = 'select usu_email from usuario where usu_email=$1'
  pool.query(sql, [req.usu_email], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "usuário com o email atual")
      response.status(200).json(results.rows)
    }
  })
}

const obterMensagensPorUsu_id_men_resposta = (request, response) => {
  const id = request
  const sql = 'SELECT * FROM mensagem m, anuncio a, usuario u ' +
    'where usu_id_men_resposta=$1 and a.anu_id=m.anu_id and m.usu_id_men_enviada=u.usu_id ' +
    'order by m.men_enviada_data desc'
  pool.query(sql, [id.usu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "mensagens recebidas")
      response.status(200).json(results.rows)
    }
  })
}

const obterMensagensPorUsu_id_men_enviada = (request, response) => {
  const id = request
  const sql = 'SELECT * FROM mensagem m, anuncio a, usuario u ' +
    'where usu_id_men_enviada=$1 and a.anu_id=m.anu_id and m.usu_id_men_resposta=u.usu_id ' +
    'order by m.men_enviada_data desc'
  pool.query(sql, [id.usu_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "mensagens enviadas")
      response.status(200).json(results.rows)
    }
  })
}

// mudar o nome
const deletarFotosAnuncio = (request, response) => {
  const nome = request.body
  const sql = 'delete from foto_anuncio where fot_descricao=$1 returning *'
  pool.query(sql, [nome.fot_descricao], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Deletado:", results.rows.length, "foto")
      response.status(200).json("Fotos removidas da base de dados com sucesso!")
    }
  })
}

const inserirAnuncio = (request, response) => {
  const id = request
  const req = request.body
  const data = new Date()
  var sql = 'INSERT INTO anuncio(anu_titulo,anu_descricao,anu_foto_capa,anu_data_cadastro, ' +
    'anu_data_alteracao,usu_id,cat_id,anu_uf,anu_cidade,anu_preco_valor,anu_preco_tipo) ' +
    'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ' +
    'returning *';
  var values = [req.anu_titulo, req.anu_descricao, req.anu_foto_capa, data, data, id.usu_id, req.cat_id,
  req.anu_uf, req.anu_cidade, req.anu_preco_valor, req.anu_preco_tipo];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Inserido:", results.rows.length, "anúncio")
      response.status(200).json(results.rows)
      // response.status(200).json("Anúncio cadastrado com sucesso!")
    }
  })
}

// mudar o nome
const inserirFotosAnuncio = (request, response) => {
  const req = request.body
  const data = new Date()
  console.log(req.fot_descricao)
  var sql = 'INSERT INTO foto_anuncio(anu_id,fot_descricao) VALUES ($1,$2) returning *';
  var values = [req.anu_id, req.fot_descricao]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Inserido:", results.rows.length, "foto do anúncio atual")
      response.status(200).json("Foto inserida com sucesso!")
    }
  })
}

const inserirMensagem = (request, response) => {
  const id = request
  const req = request.body
  console.log(req)
  console.log(id.usu_id)
  const data = new Date()
  var sql = 'insert into mensagem (men_enviada, men_enviada_data, ' +
    'usu_id_men_enviada, usu_id_men_resposta, anu_id) VALUES ($1,$2,$3,$4,$5) returning *';
  var values = [req.men_enviada, data, id.usu_id, req.usu_id_men_resposta, req.anu_id]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Inserido:", results.rows.length, "mensagem")
      response.status(200).json("Mensagem enviada com sucesso!")
    }
  })
}

const inserirUsuario = (request, response) => {
  const req = request.body
  const data = new Date()
  var sql = 'insert into usuario(usu_email,usu_senha,usu_nome,usu_telefone,usu_data_cadastro,' +
    'usu_data_alteracao,usu_pendente) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *';
  var values = [req.usu_email, req.usu_senha, req.usu_nome, req.usu_telefone, data, data, 1];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      deletarUsuario(request, response)
    }
    else {
      if (results.rows.length === 1) {
        var registro = results.rows[0]
        sql = 'insert into endereco(usu_id,end_logradouro,end_numero,end_complemento, ' +
          'end_bairro, end_cidade, end_uf, end_cep) ' +
          'VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning * ';
        values = [results.rows[0].usu_id, req.end_logradouro, req.end_numero, req.end_complemento,
        req.end_bairro, req.end_cidade, req.end_uf, req.end_cep];
        pool.query(sql, values, (error, results) => {
          if (error) {
            console.log(error)
            deletarUsuario(request, response)
          }
          else {
            console.log("Inserido:", results.rows.length, "usuário")
            mailer.sendConfirmationEmail({ toUser: registro, email: registro.usu_email })
            response.status(200).json("Usuário cadastrado com sucesso, " +
              "verifique seu e-mail para liberar o acesso")
          }
        })
      }
      else {
        deletarUsuario(request, response)
      }
    }
  })
}

const deletarUsuario = (request, response) => {
  const req = request.body
  console.log(req)
  var sql = 'delete from usuario where usu_email = $1 returning *';
  var values = [req.usu_email]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Deletado:", results.rows.length, "usuário")
      response.status(400).json("Usuário removido com sucesso!")
    }
  })
}

const alterarUsuario = (request, response) => {
  const req = request.body
  const data = new Date()
  var sql = 'UPDATE usuario SET usu_email=$1, usu_senha=$2, usu_nome=$3, ' +
    'usu_telefone=$4, usu_data_alteracao=$5 WHERE usu_email=$6 returning *';
  var values = [req.usu_email, req.usu_senha, req.usu_nome, req.usu_telefone, data, req.usu_email];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Alterado:", results.rows.length, "usuário")
      response.status(200).json("Dados alterados com sucesso!")
    }
  })
}

const alterarEnderecoPorUsu_id = (request, response) => {
  const id = request
  const req = request.body
  var sql = 'UPDATE endereco SET end_logradouro=$1,end_numero=$2,end_complemento=$3, ' +
    'end_bairro=$4, end_cidade=$5, end_uf=$6, end_cep=$7 where usu_id=$8 returning *'
  var values = [req.end_logradouro, req.end_numero, req.end_complemento,
  req.end_bairro, req.end_cidade, req.end_uf, req.end_cep, id.usu_id];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Alterado:", results.rows.length, "endereço do usuário atual")
      response.status(200).json("Endereço alterado com sucesso!")
    }
  })
}

const alterarAnuncio = (request, response) => {
  const req = request.body
  const data = new Date()
  var sql = 'UPDATE anuncio SET anu_titulo=$1, anu_descricao=$2, anu_foto_capa=$3, anu_data_alteracao=$4, ' +
    'cat_id=$5, anu_uf=$6 ,anu_cidade=$7, anu_preco_valor=$8, anu_preco_tipo=$9 WHERE anu_id=$10 returning *';
  var values = [req.anu_titulo, req.anu_descricao, req.anu_foto_capa, data, req.cat_id,
  req.anu_uf, req.anu_cidade, req.anu_preco_valor, req.anu_preco_tipo, req.anu_id];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log("erro", error)
      response.status(400).json(error)
    }
    else {
      console.log("Alterado:", results.rows.length, "anúncio")
      response.status(200).json("Anúncio alterado com sucesso!")
    }
  })
}

const alterarMensagem = (request, response) => {
  const req = request.body
  const data = new Date()
  var sql = 'UPDATE mensagem SET men_resposta=$1, men_resposta_data=$2 WHERE men_id=$3 returning *';
  var values = [req.men_resposta, data, req.men_id];
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log("erro", error)
      response.status(400).json(error)
    }
    else {
      console.log("Alterado:", results.rows.length, "mensagem")
      response.status(200).json("Resposta enviada com sucesso!")
    }
  })
}

const obterAnunciosPorAnu_titulo = (request, response) => {
  const req = request.body
  var sql = "select * from anuncio where to_tsvector(anu_titulo) @@ to_tsquery($1)"
  pool.query(sql, [req.palavras], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com as palavras chaves")
      response.status(200).json(results.rows)
    }
  })
}

const deletarAnuncio = (request, response) => {
  const req = request.body
  var sql = "delete from anuncio where anu_id=$1 returning *"
  var values = [req.anu_id]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Deletado:", results.rows.length, "anúncio")
      response.status(200).json("Anúncio deletado com sucesso!")
    }
  })
}


const obterAnunciosPorAnu_uf = (request, response) => {
  const id = request.body
  const sql = 'SELECT * FROM anuncio where anu_uf=$1'
  pool.query(sql, [id.anu_uf], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com o UF")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorAnu_cidade = (request, response) => {
  const id = request.body
  const sql = 'SELECT * FROM anuncio where anu_cidade=$1'
  pool.query(sql, [id.anu_cidade], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com a cidade")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorCat_id = (request, response) => {
  const id = request.body
  const sql = 'SELECT * FROM anuncio where cat_id=$1'
  pool.query(sql, [id.cat_id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com a categoria")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorAnu_tituloPorCat_id = (request, response) => {
  const req = request.body
  var sql = "select * from anuncio where to_tsvector(anu_titulo) " +
    "@@ to_tsquery($1) and cat_id=$2"
  var values = [req.palavras, req.cat_id]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com as palavras chaves e com a categoria")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorAnu_tituloPorAnu_uf = (request, response) => {
  const req = request.body
  var sql = "select * from anuncio where to_tsvector(anu_titulo) " +
    "@@ to_tsquery($1) and anu_uf=$2"
  var values = [req.palavras, req.anu_uf]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com as palavras chaves e com o UF")
      response.status(200).json(results.rows)
    }
  })
}

const obterAnunciosPorAnu_tituloPorAnu_cidade = (request, response) => {
  const req = request.body
  var sql = "select * from anuncio where to_tsvector(anu_titulo) " +
    "@@ to_tsquery($1) and anu_cidade=$2"
  var values = [req.palavras, req.anu_cidade]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.log(error)
      response.status(400).json(error)
    }
    else {
      console.log("Encontrado:", results.rows.length, "anúncios com as palavras chaves e com a cidade")
      response.status(200).json(results.rows)
    }
  })
}

module.exports = {
  pool,
  inserirAnuncio,
  inserirFotosAnuncio,
  inserirMensagem,
  inserirUsuario,

  obterAnuncios,
  obterAnunciosPorAnu_cidade,
  obterAnunciosPorAnu_id,
  obterAnunciosPorAnu_uf,
  obterAnunciosPorAnu_titulo,
  obterAnunciosPorAnu_tituloPorAnu_cidade,
  obterAnunciosPorAnu_tituloPorAnu_uf,
  obterAnunciosPorAnu_tituloPorCat_id,
  obterAnunciosPorCat_id,
  obterAnunciosPorUsu_id,
  obterCategorias,
  obterEnderecoPorUsu_id,
  obterFotosAnuncios,
  obterFotosAnuncioPorAnu_id,
  obterMensagensPorUsu_id_men_enviada,
  obterMensagensPorUsu_id_men_resposta,
  obterUsuarioPorUsu_id,
  obterUsuarioPorUsu_email,

  alterarAnuncio,
  alterarEnderecoPorUsu_id,
  alterarMensagem,
  alterarUsuario,

  deletarAnuncio,
  deletarFotosAnuncio,
}
