import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import axios from "axios";
import "../styles/estilos-css.css"
import Contexto from "../Contexto";
import Upload from "../components/Upload"
import Cabecalho from '../components/Cabecalho';
import { useHistory } from 'react-router';
import estilos from '../styles/estilos-js';
import api from "../service/api"
import CurrencyInput from 'react-currency-input-field';
import notificar from '../components/Notificar';

export default function CadastrarAnuncio() {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoCapa, setFotoCapa] = useState("");
  const [categoria, setCategoria] = useState("")
  const [catId, setCatId] = useState("");
  const [estadoComponente] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [uf, setUf] = useState("")
  const [cidade, setCidade] = useState("")
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [deletou, setDeletou] = useState(0);
  const [fotosAtuais, setFotosAtuais] = useState([])
  const [fotosAdicionadas, setFotosAdicionadas] = useState([]);
  const [fotosRemovidas, setFotosRemovidas] = useState([]);
  const [comValor, setComValor] = useState("")
  const [desabilitarValor, setDesabilitarValor] = useState(true)
  const [precoValor, setPrecoValor] = useState("")
  const [precoTipo, setPrecoTipo] = useState("")
  const [estadoNegociar, setEstadoNegociar] = useState(false)
  const [estadoDefinir, setEstadoDefinir] = useState(false)

  let history = useHistory();

  const {
    anuncioId,
    fileList
  } = useContext(Contexto);

  var request = {
    anu_id: anuncioId,
    anu_titulo: titulo,
    anu_descricao: descricao,
    cat_id: catId,
    anu_uf: uf,
    anu_cidade: cidade
  }

  useEffect(() => {
    limparPastaAssets()
    obterAnunciosPorAnu_id()
    obterEstados()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoComponente]);

  useEffect(() => {
    obterCidades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf]);

  useEffect(() => {
    if (comValor === "Negociável") {
      setDesabilitarValor(true)
      setEstadoNegociar(true)
      setEstadoDefinir(false)
    }
    if (comValor === "Definir") {
      setDesabilitarValor(false)
      setEstadoNegociar(false)
      setEstadoDefinir(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comValor]);

  const obterAnunciosPorAnu_id = async () => {
    var categorias = []
    await api("/obterCategorias")
      .then(r => {
        categorias = r.data
        setCategorias(r.data)
      })
    await api.post("/obterAnunciosPorAnu_id", request)
      .then(r => {
        setTitulo(r.data[0].anu_titulo)
        setDescricao(r.data[0].anu_descricao)
        setFotoCapa(r.data[0].anu_foto_capa)
        setUf(r.data[0].anu_uf)
        setCidade(r.data[0].anu_cidade)
        setCatId(r.data[0].cat_id)
        categorias.forEach(item => {
          if (item.cat_id === r.data[0].cat_id) {
            setCategoria(item.cat_descricao)
          }
        })
        if (r.data[0].anu_preco_valor) {
          setEstadoDefinir(true)
          setPrecoValor(r.data[0].anu_preco_valor)
          setPrecoTipo(r.data[0].anu_preco_tipo)
          setDesabilitarValor(false)
        }
      })
  }

  const handleSelect = (e) => {
    setCategoria(e.target.value)
    categorias.forEach(element => {
      if (element.cat_descricao === e.target.value) {
        setCatId(element.cat_id)
      }
    });
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

  const tratarTexto = (e) => {
    if (e.key === "Enter") {
      setDescricao(e.target.value + "\n")
    }
    setDescricao(e.target.value)
  }

  const inserirFotosAnuncio = (fotos) => {
    fotos.forEach(e => {
      var req = { anu_id: anuncioId, fot_descricao: e }
      api.post("/inserirFotosAnuncio", req)
    })
  }

  const limparPastaAssets = async () => {
    var fotos = []
    await api("/obterFotosAnuncios")
      .then(r => {
        r.data.forEach(element => {
          fotos = [...fotos, element.fot_descricao]
        });
      })
    await api.post("/remove", { lista: fotos })
  }

  const limparAntesInserir = () => {
    fotosRemovidas.forEach(e => {
      var req = { fot_descricao: e.name }
      api.post("/deletarFotosAnuncio", req)
    })
  }

  const alterarAnuncio = (foto) => {
    var req = {}
    if (comValor === "Negociável") {
      req = { ...request, anu_preco_valor: null, anu_preco_tipo: null, anu_foto_capa: foto }
    } else {
      req = { ...request, anu_preco_valor: parseFloat(precoValor.replace(",", ".")), anu_preco_tipo: precoTipo, anu_foto_capa: foto }
    }
    console.log(req)
    if ((
      req.anu_titulo &&
      req.anu_foto_capa &&
      req.anu_uf &&
      req.anu_cidade &&
      req.cat_id
    )) {
      api.post("/alterarAnuncio", req)
        .then(r => {
          notificar(r.data)
          history.push("/MeusAnuncios")
        })
        .catch(e => {
          notificar("Erro ao alterar anúncio, verifique os campos e tente novamente")
        })
    } else {
      notificar("Preencha todos os campos")
    }
  }

  const processarSemDeletar = () => {
    var novalista = []
    var foto = "/default/anuncio_default.png"
    if (fotosAtuais.length > 0) {
      fotosAdicionadas.forEach(f => {
        novalista.push(f.name)
      })
      inserirFotosAnuncio(novalista)
      alterarAnuncio(novalista[0])
    } else if (fileList.length > 0) {
      alterarAnuncio(fotoCapa)
    } else {
      alterarAnuncio(foto)
    }
  }

  const processarComDeletar = () => {
    var listaoriginal = []
    var lista = []
    var novalista = []
    var adicionar = []
    var foto = "/default/anuncio_default.png"
    if (fotosAtuais.length > 0) {
      fotosAtuais.forEach(e => {
        lista.push(e.name)
      })
      fotosAdicionadas.forEach(f => {
        if (lista.includes(f.name_original)) {
          novalista.push(f.name)
        }
      })
      fileList.forEach(e => {
        listaoriginal.push(e.name)
      })
      novalista.forEach(e => {
        if (!listaoriginal.includes(e)) {
          adicionar.push(e)
        }
      })
      limparAntesInserir()
      if (adicionar.length > 0) {
        inserirFotosAnuncio(adicionar)
        alterarAnuncio(adicionar[0])
      } else {
        alterarAnuncio(fotoCapa)
      }
    } else {
      limparAntesInserir()
      alterarAnuncio(foto)
    }
  }

  const processarAlteracao = () => {
    if (deletou === 0) {
      processarSemDeletar()
    } else {
      processarComDeletar()
    }
  }

  return (
    <>
      <Cabecalho />
      <Container className="margem-s p-1">
        <Row className="justify-content-center m-0">
          <Row className="justify-content-center m-0 p-0" style={{ maxWidth: "700px" }}>
            <Row className="justify-content-center pt-4 pb-3 mb-3" style={estilos.gridArredondado}>
              <Row className="p-0 pb-3 m-1 justify-content-center h3">
                Altere seu anúncio
              </Row>
              <Row className="p-0 m-1">
                <FormGroup>
                  <Label for="nome" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Título do Anúncio</Label>
                  <Input
                    type="text"
                    name="nome"
                    id="nome"
                    placeholder="Insira um título"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                  />
                </FormGroup>
              </Row>

              <Row className="p-0 m-1">
                <FormGroup >
                  <Label for="descricao " style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Descrição</Label>
                  <Input
                    type="textarea"
                    name="descricao"
                    id="descricao"
                    placeholder="Descreva seu serviço"
                    value={descricao}
                    onChange={e => tratarTexto(e)}
                  />
                </FormGroup>
              </Row>

              <Row className="p-0 m-1">
                <Col >
                  <Label for="logradouro" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Fotos do Anúncio</Label>
                  <div style={{ borderRadius: "0.25rem", border: "1px solid #ced4da", padding: "0.375rem 0.75rem", paddingTop: "0.15rem" }}>

                    <Upload
                      fileList={fileList}
                      fotoCapa={fotoCapa}
                      fotosAtuais={fotosAtuais}
                      setFotosAtuais={setFotosAtuais}
                      setFotoCapa={setFotoCapa}
                      fotosAdicionadas={fotosAdicionadas}
                      setFotosAdicionadas={setFotosAdicionadas}
                      fotosRemovidas={fotosRemovidas}
                      setFotosRemovidas={setFotosRemovidas}
                      deletou={deletou}
                      setDeletou={setDeletou}
                    />

                  </div>

                </Col>
              </Row>

              <Row className="p-0 m-1">
                <FormGroup className="" tag="fieldset" row>
                  <legend className="" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Valor do Serviço</legend>
                  <Row className="ps-5">
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" value="Negociável" checked={estadoNegociar} onChange={(e) => setComValor(e.target.value)} />{' '}
                        Negociável
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="radio" value="Definir" checked={estadoDefinir} onChange={(e) => setComValor(e.target.value)} />{' '}
                        Definir
                      </Label>
                    </FormGroup>
                  </Row>
                </FormGroup>
              </Row>

              <Row className="p-0 m-1">
                <Col md='6' >
                  <FormGroup>
                    <Label for="valor" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Valor</Label>
                    <CurrencyInput
                      disabled={desabilitarValor}
                      id="valor"
                      name="valor"
                      placeholder="Informe o valor"
                      className="form-control"
                      intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                      value={precoValor}
                      decimalsLimit={2}
                      onValueChange={(value, name) => setPrecoValor(value)}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' >
                  <FormGroup>
                    <Label for="valor-tipo" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Tipo de valor</Label>
                    <Input
                      disabled={desabilitarValor}
                      type="select"
                      name="valor-tipo"
                      id="valor-tipo"
                      className="form-select"
                      value={precoTipo}
                      onChange={e => setPrecoTipo(e.target.value)}
                    >
                      <option>Selecione o tipo</option>
                      <option>m²</option>
                      <option>hora</option>
                      <option>dia</option>
                      <option>obra</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="p-0 m-1">
                <Col >
                  <FormGroup>
                    <Label for="categoria" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Categoria</Label>
                    <Input
                      type="select"
                      name="categoria"
                      id="categoria"
                      className="form-select"
                      value={categoria}
                      onChange={e => handleSelect(e)}
                    >
                      <option>Selecione uma categoria</option>
                      {categorias.map(item =>
                        <option key={item.cat_id}>{item.cat_descricao}</option>
                      )}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="p-0 m-1">
                <Col md='3' >
                  <FormGroup>
                    <Label for="uf" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Estado</Label>
                    <Input
                      type="select"
                      name="uf"
                      id="uf"
                      className="form-select"
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
                <Col >
                  <FormGroup>
                    <Label for="cidade" style={{ fontWeight: "bold", fontSize: "0.8rem" }}>Cidade</Label>
                    <Input
                      type="select"
                      name="cidade"
                      id="cidade"
                      className="form-select"
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
              </Row>

              <Row className="d-flex justify-content-end text-end pt-3 pb-3 m-1 mb-0">
                <Col className="p-0 ps-1">
                  <Button type="button" style={{ minWidth: "100px" }} onClick={() => processarAlteracao()}>Salvar</Button>
                </Col>
              </Row>

            </Row>
          </Row>
        </Row>
      </Container>
    </>
  )
}