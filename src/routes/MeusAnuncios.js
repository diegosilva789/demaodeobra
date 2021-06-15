import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container, Col, Row, Button,
  UncontrolledButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import Contexto from "../Contexto";
import estilos from "../styles/estilos-js";
import Cabecalho from '../components/Cabecalho';
import api from "../service/api"
import InfiniteScroll from "react-infinite-scroller";
import notificar from '../components/Notificar';

export default function ListAnuncios() {

  const [anuncios, setAnuncios] = useState([])
  const [estado, setEstado] = useState(0)
  const [contadorPagina, setContadorPagina] = useState(4)
  const [total, setTotal] = useState([])

  let history = useHistory();

  const {
    setAnuncioId,
    setFileList
  } = useContext(Contexto)

  useEffect(() => {
    obterAnunciosPorUsu_id()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const obterAnunciosPorUsu_id = async () => {
    await api.post("/obterAnunciosPorUsu_id")
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice(0, contadorPagina);
        setAnuncios(slice)
      })
  }

  const deletarAnuncio = async (e) => {
    var request = { anu_id: e.target.id }
    await api.post("/deletarAnuncio", (request))
      .then(r => {
        notificar(r.data)
      })
    setEstado(estado + 1)
  }

  const obterFotosAnuncio = async (e) => {
    var request = {}
    var fotos = []
    request = { anu_id: e.target.id }
    setAnuncioId(e.target.id)
    await api.post("/obterFotosAnuncioPorAnu_id", request)
      .then(r => {
        if (r.data.length > 0) {
          var lista = r.data
          lista.forEach((element, index) => {
            var image = process.env.REACT_APP_BACKEND + '/images/' + element.fot_descricao
            var file = {
              name: element.fot_descricao,
              url: image
            }
            fotos = [...fotos, file]
          });
          setFileList(fotos)
        } else {
          setFileList([])
        }
      })
  }

  const prepararAlterar = async (e) => {
    await obterFotosAnuncio(e);
    history.push('/AlterarAnuncio')
  }

  const trocarPagina = () => {
    setTimeout(function () {
      setContadorPagina(contadorPagina + 2)
      const slice = total.slice(0, contadorPagina);
      setAnuncios(slice)
    }, 1000);
  }

  return (
    <>
      <Cabecalho />
      <Container className="d-flex flex-nowrap ps-0 pe-0 pb-4 justify-content-center margem-s" style={{ wordWrap: "break-word" }} >
        <Row className="justify-content-center p-0 m-0" >
          <Row className="p-0 m-0" style={{ maxWidth: "850px" }} >
            <InfiniteScroll
              className="p-0 m-0"
              pageStart={0}
              loadMore={trocarPagina}
              hasMore={anuncios.length === total.length ? false : true}
              loader={<h5 key="carregando" className="text-center pt-4">Carregando...</h5>}
            >
              <Row className="justify-content-center m-1">
                <Row className="h4 pb-1" style={{ maxWidth: 984 }} >
                  Anúncios Ativos
                </Row>
                <Row style={{ maxWidth: 984 }}>
                  <Row className="p-0 pt-2 m-0 mb-4">
                    <Button type="button" style={{ float: "right" }} onClick={() => history.push("/CadastrarAnuncio")}>
                      Cadastrar novo Anúncio
                    </Button>
                  </Row>
                </Row>
                {total.length === 0 &&
                  <Row className="justify-content-center text-center p-0 m-0 pt-5 pb-5" style={estilos.gridAnuncios}>
                    <h5>Você ainda não possui anúncios publicados</h5>
                  </Row>
                }
                <Row className="justify-content-center p-0 m-0" style={estilos.gridAnuncios} >
                  {anuncios.map(item =>
                    <Row key={item.anu_id} className="p-0 m-0" style={{ borderBottom: "1px solid #efefef" }}>
                      <Col xs="auto" className="d-flex align-self-start p-0 m-0">
                        <a className="p-0" href={`/Anuncio/${item.anu_id}`}><img style={{ padding: 5, width: 88, height: 88, objectFit: "cover" }} src={`${process.env.REACT_APP_BACKEND}/images/${item.anu_foto_capa}`} alt=""></img></a>
                      </Col>
                      <Col xs="" className="p-2 d-flex align-itens-center">
                        <Row className="d-flex align-itens-center" style={{ padding: 5 }}>
                          <Row className="m-0 ps-0 pt-2 pb-0"><a className="p-0" href={`/Anuncio/${item.anu_id}`}>{item.anu_titulo}</a></Row>
                          <Row className="m-0 ps-0 pt-0 pb-2" style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                            <p className="p-0 m-0">Data de Publicação:
                              <span> {item.anu_data_cadastro.substring(8, 10) + "/" + item.anu_data_cadastro.substring(5, 7) + "/" + item.anu_data_cadastro.substring(0, 4)}</span>
                            </p>
                          </Row>
                        </Row>
                      </Col>
                      <Col xs="auto" className="d-none d-sm-block d-flex align-self-center text-center p-0 m-1">
                        <Button className="m-0" id={item.anu_id}
                          onClick={(e) => prepararAlterar(e)}>
                          Alterar</Button>
                      </Col>
                      <Col xs="auto" className="d-flex align-self-center text-end p-0 pe-1" >
                        <UncontrolledButtonDropdown direction="left" className="d-flex align-self-center text-end">
                          <DropdownToggle color="white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem className="d-block d-sm-none" id={item.anu_id} onClick={(e) => prepararAlterar(e)}>Alterar</DropdownItem>
                            <DropdownItem id={item.anu_id} onClick={(e) => deletarAnuncio(e)}>Deletar</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </Col>
                    </Row>
                  )}
                </Row>
              </Row>
            </InfiniteScroll>
          </Row>
        </Row>
      </Container>
    </>
  )
}
