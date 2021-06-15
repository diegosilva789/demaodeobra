const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = function ({ toUser, email }) {

  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD
      }
    })

    const message = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: 'demaodeobra - Ative sua conta',
      html: `
        <h3>Olá ${toUser.usu_nome}</h3>
        <p>Seja bem-vindo, agora você poderá estar mais próximo dos seus clientes anunciando os seus servicos na nossa plataforma.</p>
        <p>Antes de continuar, ative a sua conta clicando no link: <a target="_" href="${process.env.DOMAIN}/AtivarUsuario/${email}">${process.env.DOMAIN}/AtivarUsuario </a></p>
        <p>Bons Negócios,</p>
        <p>Equipe demaodeobra</p>
      `
    }

    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err)
        rej(err)
      } else {
        console.log("E-mail de ativação enviado com sucesso!")
        res("E-mail de ativação enviado com sucesso!")
      }
    })
  })
}