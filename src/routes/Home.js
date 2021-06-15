import React, { useState, useEffect } from 'react';
import { Link, } from "react-router-dom";
import {
  Container, Col, Row, Input,
  ListGroup, ListGroupItem,
  Card, CardImg, CardTitle,
  CardText, CardBody, Label
} from "reactstrap";
import axios from "axios";
import estilos from "../styles/estilos-js"
import Cabecalho from '../components/Cabecalho';
import Pagination from "react-js-pagination";
import api from "../service/api"

export default function Home() {

  const [anuncios, setAnuncios] = useState([])
  const [categorias, setCategorias] = useState([])
  const [estado, setEstado] = useState(0)
  const [contadorPagina, setContadorPagina] = useState(1)
  const [total, setTotal] = useState([])
  const [uf, setUf] = useState("")
  const [estados, setEstados] = useState([])
  const [cidade, setCidade] = useState("")
  const [cidades, setCidades] = useState([]);
  const [exibirCidades, setExibirCidades] = useState(false)

  useEffect(() => {
    obterAnuncios()
    obterCategorias()
    obterEstados()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  useEffect(() => {
    obterCidades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf]);

  const trocarPagina = (e) => {
    setContadorPagina(e)
    setEstado(estado + 1)
  }

  const obterAnuncios = async () => {
    await api("/obterAnuncios")
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice((contadorPagina - 1) * 12, contadorPagina * 12);
        setAnuncios(slice)
      })
  }

  const obterAnunciosPorCat_id = async (request) => {
    await api.post("/obterAnunciosPorCat_id", (request))
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice((contadorPagina - 1) * 12, contadorPagina * 12);
        setAnuncios(slice)
      })
  }

  const obterAnunciosPorAnu_uf = async (request) => {
    setUf(request.anu_uf)
    await api.post("/obterAnunciosPorAnu_uf", (request))
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice((contadorPagina - 1) * 12, contadorPagina * 12);
        setAnuncios(slice)
        setExibirCidades(true)
      })
  }

  const obterAnunciosPorAnu_cidade = async (request) => {
    setCidade(request.anu_cidade)
    await api.post("/obterAnunciosPorAnu_cidade", (request))
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice((contadorPagina - 1) * 12, contadorPagina * 12);
        setAnuncios(slice)
      })
  }

  const obterCategorias = async () => {
    await api("/obterCategorias")
      .then(r => {
        setCategorias(r.data)
      })
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

  const ativar = (e) => {
    var current = document.getElementById(e.target.id)
    current.className = "lista-ativo " + current.className.replaceAll("lista-inativo ", "")
    categorias.forEach(i => {
      if (!e.target.id.includes(i.cat_id)) {
        var item = document.getElementById(i.cat_id)
        item.className = item.className.replaceAll("lista-ativo", "lista-inativo")
      }
    })
  }

  return (
    <>
      <Cabecalho />
      <div className="margem-s d-block d-md-none ms-0 me-0 p-0" style={{ backgroundColor: "white" }} >
        <Container className="p-3 pb-0">
          <Row className="justify-content-center m-0 p-0">
            <Col xs="12" className="h1 p-0 mb-0" >
              Categorias
              <p style={{ fontSize: "0.9rem", fontWeight: 400, paddingTop: "10px" }}>{total.length} anúncios</p>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="d-block d-md-none ms-0 me-0 p-0" style={{ backgroundColor: "#136BA4" }} >
        <Container className="p-3">
          <Row className="justify-content-center m-0 p-0">
            <Col xs="6">
              {categorias.slice(0, Math.round(categorias.length / 2)).map(item =>
                <Row className="ps-0 pe-0" style={{
                  paddingTop: ".25rem", paddingBottom: ".25rem",
                  backgroundColor: "#136BA4", color: "white"
                }}
                  key={item.cat_id} tag="button"
                  onClick={() => obterAnunciosPorCat_id(item)}>
                  {item.cat_descricao}
                </Row>
              )}
            </Col>
            <Col xs="6">
              {categorias.slice(Math.round(categorias.length / 2), categorias.length).map(item =>
                <Row className="ps-0 pe-0" style={{
                  paddingTop: ".25rem", paddingBottom: ".25rem",
                  backgroundColor: "#136BA4", color: "white"
                }}
                  key={item.cat_id} tag="button"
                  onClick={() => obterAnunciosPorCat_id(item)}>
                  {item.cat_descricao}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="margem-s">
        <Row>
          <Col sm="3" md="3" lg="3" className="d-none d-md-block pt-5"
            style={{ paddingLeft: ".25rem", paddingRight: ".25rem" }}>
            <Col className="h4 pb-4 ps-3">
              Categorias
              <p style={{ fontSize: "0.7rem", paddingTop: "10px" }}>{total.length} anúncios</p>
            </Col>
            <ListGroup className="me-3" style={estilos.grid}>
              {categorias.map(item =>
                <ListGroupItem key={item.cat_id} tag="button" action id={item.cat_id}
                  onClick={(e) => { ativar(e); obterAnunciosPorCat_id(item) }}>
                  {item.cat_descricao}
                </ListGroupItem>
              )}
            </ListGroup>
          </Col>
          <Col className="pt-1">
            <Row sm="12" className="d-flex justify-content-end mb-3"
              style={{ paddingLeft: ".4rem", paddingRight: ".4rem" }}>
              <Col sm="auto" className="align-self-center">
              </Col>
              <Col sm="auto" className="align-self-center ps-0">
                <Label style={{ float: "right" }}>Filtrar por</Label>
              </Col>
              <Col sm="auto" className="ps-0 pe-0">
                <Input
                  type="select"
                  name="select"
                  id="select"
                  className="form-select"
                  value={uf}
                  onChange={(e) => obterAnunciosPorAnu_uf({ anu_uf: e.target.value })}
                >
                  <option key="0">Estado</option>
                  {estados.map((item, index) =>
                    <option key={estado + index + 1}>{item.sigla}</option>
                  )}
                </Input>
              </Col>
              {exibirCidades === true &&
                <Col sm="auto" className="align-self-center">
                  <Label style={{ float: "right" }}>Filtrar por</Label>
                </Col>
              }
              {exibirCidades === true &&
                <Col sm="auto" className="ps-0 pe-0">
                  <Input
                    type="select"
                    name="select2"
                    id="select2"
                    className="form-select"
                    value={cidade}
                    onChange={(e) => obterAnunciosPorAnu_cidade({ anu_cidade: e.target.value })}
                  >
                    <option>Cidade</option>
                    {cidades.map(item =>
                      <option>{item.nome}</option>
                    )}
                  </Input>
                </Col>
              }
            </Row>
            <Row className="" >
              {anuncios.map(item =>
                <Col key={item.anu_id}
                  xs="w-100" sm="6" md="6" lg="4"
                  className=" pb-3"
                  style={{ paddingLeft: ".40rem", paddingRight: ".40rem" }}
                >
                  <Link
                    to={{
                      pathname: `/Anuncio/${item.anu_id}`,
                      state: { id: item.anu_id }
                    }}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <Card className="h-100 cartao" style={estilos.card} title={item.anu_titulo}>
                      <CardImg top width="100%" style={{ objectFit: "cover", height: "18rem" }} src={`${process.env.REACT_APP_BACKEND}/images/${item.anu_foto_capa}`} alt="Card image cap" />
                      <CardBody>
                        <CardTitle tag="h5"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {item.anu_titulo}
                        </CardTitle>
                        <CardText style={{ textAlign: "end", }}>{item.anu_cidade}-{item.anu_uf}</CardText>
                      </CardBody>
                      <CardBody style={{ backgroundColor: "#BCFD5E", paddingTop: 25, borderRadius: "0 0 0.25rem 0.25rem" }}>
                        <CardText style={{ textAlign: "end", marginTop: -10, fontWeight: "500", fontSize: "1.2rem" }}>
                          {(item.anu_preco_valor === null || '')
                            ? "Negocie o valor"
                            : <span style={{ fontSize: "1.5rem" }}> {parseFloat(item.anu_preco_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<span style={{ fontSize: "1.2rem" }}>/{item.anu_preco_tipo}</span></span>
                          }
                        </CardText>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}
            </Row>
            <Row className="mt-4 mb-4">
              {total.length > 12 &&
                <Pagination
                  activePage={contadorPagina}
                  itemsCountPerPage={12}
                  totalItemsCount={total.length}
                  pageRangeDisplayed={5}
                  onChange={(e) => trocarPagina(e)}
                  innerClass="MuiPagination-ul justify-content-center p-0 mb-2"
                  activeClass="ativo"
                  linkClass=""
                  itemClass="MuiButtonBase-root MuiPaginationItem-root"
                  disabledClass="disabled"
                  prevPageText={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                  }
                  nextPageText={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                    </svg>
                  }
                  hideDisabled={true}
                  hideFirstLastPages={true}
                />
              }
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}