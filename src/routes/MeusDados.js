import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Col, Row, Button, Input } from "reactstrap";
import estilos from "../styles/estilos-js"
import Cabecalho from '../components/Cabecalho';
import api from "../service/api"

export default function MeusDados() {

  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [estado] = useState(0);

  const history = useHistory()

  useEffect(() => {
    obterUsuarioPorUsu_id()
    obterEnderecoPorUsu_id()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const obterUsuarioPorUsu_id = async () => {
    await api.post("/obterUsuarioPorUsu_id")
      .then(r => {
        setNome(r.data[0].usu_nome)
        setEmail(r.data[0].usu_email)
        setSenha(r.data[0].usu_senha)
        mascararTelefone(r.data[0].usu_telefone)
      })
  };

  const obterEnderecoPorUsu_id = async () => {
    await api.post("/obterEnderecoPorUsu_id")
      .then(r => {
        setLogradouro(r.data[0].end_logradouro)
        setNumero(r.data[0].end_numero)
        setComplemento(r.data[0].end_complemento)
        setBairro(r.data[0].end_bairro)
        setCidade(r.data[0].end_cidade)
        setUf(r.data[0].end_uf)
        mascararCep(r.data[0].end_cep)
      })
  }

  const mascararTelefone = (telefone) => {
    var valor = telefone.replace(/\D/g, "")
    setTelefone(valor)
    if (valor < 10) {
      setTelefone(valor)
    }
    if (valor.length === 10) {
      setTelefone("(" + valor.substring(0, 2) + ") " + valor.substring(2, 6) + "-" + valor.substring(6,))
    }
    if (valor.length === 11) {
      setTelefone("(" + valor.substring(0, 2) + ") " + valor.substring(2, 7) + "-" + valor.substring(7,))
    }
  }

  const mascararCep = (cep) => {
    var valor = cep.replace(/\D/g, "")
    setCep(valor)
    if (valor.length < 8) {
      setCep(valor)
    }
    if (valor.length === 8) {
      setCep(valor.substring(0, 5) + "-" + valor.substring(5,))
    }
  }

  return (
    <>
      <Cabecalho

      />
      <Container className="ps-0 pe-0 justify-content-center margem-s" style={{ wordWrap: "break-word" }}>
        <Row className="justify-content-center mt-1">
          <Row className="w-75 h4 pb-4">Meus Dados</Row>
          <Row className="w-75 h5 pb-2">Dados da conta</Row>
          <Row className="w-75 p-0" style={estilos.gridArredondado}>
            <Row className="justify-content-center m-0" style={{ borderBottom: "1px solid #efefef" }}>
              <Col xs="6" className="p-2">E-mail:</Col>
              <Col xs="6" className="p-2" style={{ color: "#00000073" }}>{email}</Col>
            </Row>
            <Row className="justify-content-center m-0">
              <Col xs="6" className="p-2">Senha:</Col>
              <Col xs="6" className="p-2" type="password" style={{ color: "#00000073" }}>
                <Input className="m-0 p-0" value={senha} type="password" disabled style={{ border: 0, color: "#00000073", backgroundColor: "white" }} />
              </Col>
            </Row>
          </Row>
          <Row className="w-75 h5 pt-4 pb-2">Dados Pessoais</Row>
          <Row className="w-75 p-0" style={estilos.gridArredondado}>
            <Row className="justify-content-center m-0" style={{ borderBottom: "1px solid #efefef" }}>
              <Col xs="6" className="p-2">Nome Completo:</Col>
              <Col xs="6" className="p-2" style={{ color: "#00000073" }}>{nome}</Col>
            </Row>
            <Row className="justify-content-center m-0">
              <Col xs="6" className="p-2" >Telefone:</Col>
              <Col xs="6" className="p-2" style={{ color: "#00000073" }}>{telefone}</Col>
            </Row>
          </Row>
          <Row className="w-75 h5 pt-4 pb-2">Endereço</Row>
          <Row className="w-75 p-0" style={estilos.gridArredondado}>
            <Row className="justify-content-center m-0">
              <Col xs="12" className="p-2 pt-4">{logradouro}, {numero}</Col>
              <Col xs="12" className="ps-2" style={{ color: "#00000073", lineHeight: 1.25, fontSize: 14 }}>{complemento}</Col>
              <Col xs="12" className="ps-2" style={{ color: "#00000073", lineHeight: 1.25, fontSize: 14 }}>{bairro}</Col>
              <Col xs="12" className="ps-2" style={{ color: "#00000073", lineHeight: 1.25, fontSize: 14 }}>{cidade}-{uf}</Col>
              <Col xs="12" className="ps-2 pb-4" style={{ color: "#00000073", lineHeight: 1.25, fontSize: 14 }}>{cep}</Col>
            </Row>
          </Row>
          <Row className="w-75">
            <Row className="p-0 pt-4 m-0">
              <Button type="button" style={{ float: "right" }} onClick={() => history.push('/AlterarUsuario')}>Alterar Dados e Senha</Button>
            </Row>
          </Row>
        </Row>
      </Container>
    </>
  )
}