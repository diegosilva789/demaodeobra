import React, { useState } from 'react';
import { Button, Form, Row, FormGroup, Input, Label, Container, Col } from "reactstrap";
import Cabecalho from '../components/Cabecalho';
import estilos from "../styles/estilos-js"
import api from "../service/api"
import notificar from '../components/Notificar';

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  var request = {
    usu_email: email,
    usu_senha: senha,
  }

  const login = async () => {
    await api.post("/login", request)
      .then(r => {
        localStorage.setItem('token', r.data.token);
        window.location.href = '/MeusAnuncios'
      })
      .catch(e => {
        console.log(e.response.data)
        notificar(e.response.data)
      })
  }

  return (
    <>
      <Cabecalho />
      <div>
        <Container className="justify-content-center" style={estilos.login}>
          <Row className="p-1 pt-5 justify-content-center h3" style={estilos.gridLogin}>
            <Row className="p-0 pb-3 m-1 justify-content-center h3">Login</Row>
            <Form className="ps-5 pe-5" onSubmit={login} >
              <FormGroup>
                <Label for="email" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  autoComplete="username email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Senha</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Digite sua senha"
                  autoComplete="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                />
              </FormGroup>
            </Form>
            <Col className="p-1 pb-4 pt-4 text-center">
              <Button type="submit" style={{ width: "150px" }} onClick={() => login()}>Entrar</Button>
            </Col>
            <Row className="text-center pt-3 pb-5" style={{ fontSize: "1rem", fontWeight: "normal" }}>
              <div>Não tem uma conta?<a href="/CadastrarUsuario" style={{ color: "#136BA4", fontWeight: "bold" }}> Cadastre-se</a></div>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  )
}