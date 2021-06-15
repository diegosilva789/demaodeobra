import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  Container, Button, FormGroup,
  Label, Input, Row, Col, Form,
} from "reactstrap";
import axios from "axios";
import Cabecalho from '../components/Cabecalho';
import estilos from '../styles/estilos-js';
import api from "../service/api"
import notificar from '../components/Notificar';

export default function AlterarUsuario() {

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
  const [estados, setEstados] = useState([]);
  const [estadoComponente] = useState(0);
  const [cidades, setCidades] = useState([]);
  const history = useHistory();
  const [copiaSenha, setCopiaSenha] = useState("")
  const [senhaValida, setSenhaValida] = useState(false)
  const [senhaInvalida, setSenhaInvalida] = useState(true)

  var request = {
    usu_email: email,
    usu_senha: senha,
    usu_nome: nome,
    usu_telefone: telefone.replace(/\D/g, ""),
    end_logradouro: logradouro,
    end_numero: numero,
    end_complemento: complemento,
    end_bairro: bairro,
    end_cidade: cidade,
    end_uf: uf,
    end_cep: cep.replace(/\D/g, "")
  }

  useEffect(() => {
    obterEstados()
    obterUsuarioPorUsu_id()
    obterEnderecoPorUsu_id()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoComponente]);

  useEffect(() => {
    obterCidades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf]);

  useEffect(() => {
    obterEnderecoPorCep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);


  useEffect(() => {
    compararSenha()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiaSenha, senha]);


  const obterUsuarioPorUsu_id = async () => {
    await api.post("/obterUsuarioPorUsu_id")
      .then(r => {
        setNome(r.data[0].usu_nome)
        setEmail(r.data[0].usu_email)
        setSenha(r.data[0].usu_senha)
        setCopiaSenha(r.data[0].usu_senha)
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
  };

  const obterEnderecoPorCep = async () => {
    var valor = cep.replace(/\D/g, "")
    await axios("https://viacep.com.br/ws/" + valor + "/json")
      .then(r => {
        setLogradouro(r.data.logradouro)
        setBairro(r.data.bairro)
        setCidade(r.data.localidade)
        setUf(r.data.uf)
      })
  };

  const limpar = () => {
    setEmail("")
    setSenha("")
    setCopiaSenha("")
    setNome("")
    setTelefone("")
    setCep("")
    setLogradouro("")
    setNumero("")
    setComplemento("")
    setBairro("")
    setCidade("")
    setUf("")
  }

  const obterEstados = async () => {
    await axios("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(r => {
        var lista = r.data
        lista.sort((a, b) => a.sigla.localeCompare(b.sigla))
        setEstados(r.data)
      })
  }

  const obterCidades = async () => {
    await axios("https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + uf + "/municipios")
      .then(r => {
        setCidades(r.data)
      })
  }

  const alterarUsuario = async () => {
    if ((
      request.usu_email &&
      request.usu_senha &&
      request.usu_nome &&
      request.usu_telefone &&
      request.end_cep &&
      request.end_logradouro &&
      request.end_numero &&
      request.end_bairro &&
      request.end_uf &&
      request.end_cidade &&
      copiaSenha
    )) {
      await api.post("/alterarUsuario", request)
        .then(r => {
          api.post("/alterarEnderecoPorUsu_id", request)
          notificar(r.data)
          history.push("/MeusDados")
        })
        .catch(e => {
          notificar("Erro ao alterar usuário, verifique os campos e tente novamente")
        })
    } else {
      notificar("Preencha todos os campos")
    }
  }

  const compararSenha = () => {
    if (copiaSenha === senha && senha !== "" && copiaSenha !== "") {
      setSenhaValida(true)
      setSenhaInvalida(false)
    } else {
      setSenhaValida(false)
      setSenhaInvalida(true)
    }
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
      <Cabecalho />
      <Container className="margem-s w-75 p-1 mb-4">
        <Row className="justify-content-center p-0 m-0 pt-4 pb-3 mb-3" style={estilos.gridArredondado} >

          <Row className="p-0 pb-3 m-1 justify-content-center h3">
            Altere seus dados
          </Row>
          <Row className="p-0 m-1" >
            <Col md='1' style={{ fontWeight: "bold", fontSize: "0.8rem" }}></Col>
            <Col md='10'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="email">E-mail</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="E-mail"
                  autoComplete="username email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='5'>
              <Form>
                <FormGroup>
                  <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="password">Senha</Label>
                  <Input valid={senhaValida} invalid={senhaInvalida}
                    type="password"
                    name="password"
                    id="password"
                    value={senha}
                    autoComplete="new-password"
                    onChange={e => setSenha(e.target.value)}
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col md='5'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='5'>
              <Form>
                <FormGroup>
                  <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="copia-senha">Senha</Label>
                  <Input valid={senhaValida} invalid={senhaInvalida}
                    type="password"
                    name="copia-senha"
                    id="copia-senha"
                    value={copiaSenha}
                    autoComplete="new-password"
                    onChange={e => setCopiaSenha(e.target.value)}
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col md='5'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1" >
            <Col md='1' style={{ fontWeight: "bold", fontSize: "0.8rem" }}></Col>
            <Col md='10'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="nome">Nome</Label>
                <Input
                  type="text"
                  name="nome"
                  id="nome"
                  placeholder="Nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='4'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="telefone">Telefone</Label>
                <Input
                  type="text"
                  name="telefone"
                  id="telefone"
                  placeholder="Telefone ou Celular"
                  value={telefone}
                  onChange={e => mascararTelefone(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='6'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1" >
            <Col md='1' style={{ fontWeight: "bold", fontSize: "0.8rem" }}></Col>
            <Col md='4'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="cep">CEP</Label>
                <Input
                  name="cep"
                  id="cep"
                  value={cep}
                  placeholder="CEP"
                  onChange={e => mascararCep(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='6'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='7'>
              <FormGroup className="mt-1 mb-1">
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="logradouro">Logradouro</Label>
                <Input
                  type="text"
                  name="logradouro"
                  id="logradouro"
                  placeholder="Avenida, Rua, Logradouro, etc"
                  value={logradouro}
                  onChange={e => setLogradouro(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='3'>
              <FormGroup className="mt-1 mb-1">
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="numero">Número</Label>
                <Input
                  type="text"
                  name="numero"
                  id="numero"
                  placeholder="Número"
                  value={numero}
                  onChange={e => setNumero(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='7'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="complemento">Complemento</Label>
                <Input
                  type="text"
                  name="complemento"
                  id="complemento"
                  placeholder="Complemento"
                  value={complemento}
                  onChange={e => setComplemento(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='3'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='7'>
              <FormGroup>
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="bairro">Bairro</Label>
                <Input
                  type="text"
                  name="bairro"
                  id="bairro"
                  placeholder="Bairro"
                  value={bairro}
                  onChange={e => setBairro(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md='3'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="p-0 m-1">
            <Col md='1'></Col>
            <Col md='2' >
              <FormGroup className="mt-1 mb-1">
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="select">Estado</Label>
                <Input
                  type="select"
                  name="select"
                  id="select"
                  value={uf}
                  onChange={e => setUf(e.target.value)}
                >
                  <option>Estado</option>
                  {estados.map(item =>
                    <option key={item.sigla}>{item.sigla}</option>
                  )}
                </Input>
              </FormGroup>
            </Col>
            <Col md='5'>
              <FormGroup className="mt-1 mb-1">
                <Label style={{ fontWeight: "bold", fontSize: "0.8rem" }} for="selectcidade">Cidade</Label>
                <Input
                  type="select"
                  name="selectcidade"
                  id="selectcidade"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                >
                  <option>Cidade</option>
                  {cidades.map(item =>
                    <option key={item.id}>{item.nome}</option>
                  )}
                </Input>
              </FormGroup>
            </Col>
            <Col md='3'></Col>
            <Col md='1' className="p-0"></Col>
          </Row>

          <Row className="d-flex justify-content-end ps-0 pe-0 pt-3 pb-3 m-1 mb-0" >
            <Col md='1'></Col>
            <Col md="2" className="pb-3">
              <Button className="w-100" type="button" onClick={() => limpar()}>Limpar</Button>
            </Col>
            <Col md="2" className="pb-3">
              <Button className="w-100" type="button" onClick={() => alterarUsuario()}>Salvar</Button>
            </Col>
            <Col md="1"></Col>

          </Row>
        </Row>
        <Row>

        </Row>
      </Container>
    </>
  )
}