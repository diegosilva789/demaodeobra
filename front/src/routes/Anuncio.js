import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button } from "reactstrap";
import "../styles/estilos-css.css"
import Contexto from "../Contexto";
import Cabecalho from '../components/Cabecalho';
import Carrousel from '../components/Carousel';
import { useParams } from 'react-router';
import EnviarMensagem from '../components/EnviarMensagem';
import api from "../service/api"
import { useHistory } from 'react-router-dom';

export default function Anuncio() {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotosAnuncio, setFotosAnuncio] = useState([]);
  const [categoria, setCategoria] = useState("")
  const [estadoComponente] = useState(0);
  const [uf, setUf] = useState("")
  const [cidade, setCidade] = useState("")
  const [usuarioRespostaId, setUsuarioRespostaId] = useState("")
  const [precoValor, setPrecoValor] = useState("")
  const [precoTipo, setPrecoTipo] = useState("")
  const [telefone, setTelefone] = useState("")
  const [nomeAnunciante, setNomeAnunciante] = useState("")
  const [exibir, setExibir] = useState(false)
  const [dataPublicacao, setDataPublicacao] = useState("")

  const { id } = useParams()

  const history = useHistory()

  const {
    anuncioId,
    setAnuncioId
  } = useContext(Contexto);

  useEffect(() => {
    obterFotosAnuncio()
    obterAnunciosPorAnu_id()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoComponente]);

  const obterAnunciosPorAnu_id = async () => {
    var request = {
      anu_id: id,
    }
    setAnuncioId(id)
    await api.post("/obterAnunciosPorAnu_id", request)
      .then(r => {
        setTitulo(r.data[0].anu_titulo)
        setDescricao(r.data[0].anu_descricao)
        setUf(r.data[0].anu_uf)
        setCidade(r.data[0].anu_cidade)
        setPrecoValor(r.data[0].anu_preco_valor)
        setPrecoTipo(r.data[0].anu_preco_tipo)
        setUsuarioRespostaId(r.data[0].usu_id)
        setNomeAnunciante(r.data[0].usu_nome.split(" ")[0])
        mascararTelefone(r.data[0].usu_telefone)
        mascararData(r.data[0].anu_data_cadastro)
        var catId = r.data[0].cat_id
        api("/obterCategorias")
          .then(r => {
            r.data.forEach(item => {
              if (item.cat_id === catId) {
                setCategoria(item.cat_descricao)
              }
            })
          })
      })
  }

  const obterFotosAnuncio = async () => {
    var request = {
      anu_id: id,
    }
    var fotos = []
    var lista = []
    await api.post("/obterFotosAnuncioPorAnu_id", request)
      .then(r => {
        if (r.data.length > 0) {
          lista = r.data
          lista.forEach((element, index) => {
            var image = process.env.REACT_APP_BACKEND + '/images/' + element.fot_descricao
            var file = {
              src: image,
              altText: index + 1,
              caption: "imagem " + index + 1
            }
            fotos = [...fotos, file]
          });
          setFotosAnuncio(fotos)
        } else {
          fotos = [{
            src: process.env.REACT_APP_BACKEND + "/images/default/anuncio_default.png"
          }]
          setFotosAnuncio(fotos)
        }
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

  const mascararData = (data) => {
    var valor = data.replace(/\D/g, "")
    valor = valor.substring(6, 8) + "/" + valor.substring(4, 6) + "/" + valor.substring(0, 4)
    setDataPublicacao(valor)
  }

  const visualizarTelefone = () => {
    if (localStorage.getItem("token")) {
      setExibir(true)
    } else {
      history.push("/Login")
    }
  }

  return (
    <>
      <Cabecalho />
      <Container>
        <Row>

          <Col className="carrousel-fotos position-fixed d-none d-md-block ps-0 pe-0"
            style={{ backgroundColor: "black" }}>
            <Carrousel items={fotosAnuncio} />
          </Col>

          <Col
            className="descricao-anuncio d-none d-md-block "
            style={{
              backgroundColor: "white", paddingTop: 100,
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 12%)", textAlign: "justify",
              minHeight: "100vh"
            }}>
            <Col className="w-75">
              <Col className="h3 pb-0 mb-0">
                {titulo}
              </Col>
              <Col className="p-0 m-0 pb-2" style={{ color: "grey", fontSize: "0.9rem" }}>
                Anunciado por {nomeAnunciante}
              </Col>
              <Col>
                <div style={{ paddingBottom: "16px" }}>
                  {(precoValor === null || '')
                    ? <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Negocie o valor</span>
                    : <>
                      <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                        {parseFloat(precoValor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span style={{ fontSize: "2.5rem" }}>/{precoTipo}</span>
                    </>
                  }
                </div>
              </Col>
              <Col>
                <span className="h6">Categoria:</span> {categoria}
              </Col>
              <Col>
                <span className="h6">Localização:</span> {cidade}-{uf}
              </Col>
              <Col>
                <span className="h6">Data de Publicação:</span> {dataPublicacao}
              </Col>
            </Col>
            <Col>
              <Row className="mt-5 mb-3">
                <p className="h6">Telefone: {exibir ? <span style={{ fontSize: "1rem", fontWeight: "normal" }}>{telefone}</span>
                  : <span>
                    <Button className="ms-2 me-2" type="button" onClick={() => visualizarTelefone()}>
                      Ver telefone
                    </Button>
                  </span>
                }
                </p>
              </Row>
              <EnviarMensagem usuarioRespostaId={usuarioRespostaId} anuncioId={anuncioId} />
            </Col>
            <Col className="h4 mt-5 mb-3 pt-4" style={{ borderTop: "1px solid #efefef" }}>
              Descrição
            </Col>
            <Col className="pb-5" style={{ whiteSpace: "pre-wrap" }}>
              {descricao}
            </Col>
          </Col>

          <Col className="margem-s d-block d-md-none ps-0 pe-0"
            style={{ backgroundColor: "black" }}>
            <Carrousel items={fotosAnuncio} />
          </Col>

          <Col
            className="d-block d-md-none pt-3"
            style={{
              backgroundColor: "white", marginBottom: "24px",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 12%)", textAlign: "justify"
            }}>
            <Col className="w-75">
              <Col className="h3 pb-0 mb-0">
                {titulo}
              </Col>
              <Col className="p-0 m-0 pb-2" style={{ color: "grey", fontSize: "0.9rem" }}>
                Anunciado por -User-
              </Col>
              <Col>
                <div style={{
                }}>
                  <span style={{ fontSize: "3rem", fontWeight: "bold" }}>{parseFloat(precoValor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <span style={{ fontSize: "2.5rem" }}>/{precoTipo}</span>
                </div>
              </Col>
              <Col>
                <span className="h6">Categoria:</span> {categoria}
              </Col>
              <Col>
                <span className="h6">Localização:</span> {cidade}-{uf}
              </Col>
            </Col>
            <Col>
              <Row className="mt-5 mb-3">
                <span className="h6">Telefone:
                  <Button className="ms-2 me-2">
                    Ver telefone
                  </Button>
                </span>
              </Row>
              <EnviarMensagem usuarioRespostaId={usuarioRespostaId} anuncioId={anuncioId} />
            </Col>
            <Col className="h4 mt-5 mb-3 pt-4" style={{ borderTop: "1px solid #efefef" }}>
              Descrição
            </Col>
            <Col className="pb-5" style={{ whiteSpace: "pre-wrap" }}>
              {descricao}
            </Col>
          </Col>
        </Row>
        <Row>
        </Row>
      </Container>
    </>
  )
}