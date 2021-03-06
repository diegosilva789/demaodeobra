import React, { useState, useEffect } from 'react';
import { Col, Container, Row, FormGroup, Input, Button } from 'reactstrap';
import estilos from '../styles/estilos-js';
import Cabecalho from '../components/Cabecalho';
import MenBarraNav from '../components/MenBarraNav';
import api from "../service/api"
import notificar from '../components/Notificar';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroller";

export default function MensagensRecebidas() {

  const [mensagensRecebidas, setMensagensRecebidas] = useState([])
  const [contadorPagina, setContadorPagina] = useState(4)
  const [estado] = useState(0)
  const [total, setTotal] = useState([])
  const [mensagem, setMensagem] = useState("")
  const [abaMensagensRec, setAbaMensagensRec] = useState(true)
  const [abaMensagensEnv, setAbaMensagensEnv] = useState(false)

  const history = useHistory()

  useEffect(() => {
    obterMensagensRecebidas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const obterMensagensRecebidas = async () => {
    await api.post("/obterMensagensPorUsu_id_men_resposta", ({ usu_id_men_resposta: localStorage.getItem('usuarioId') }))
      .then(r => {
        setTotal(r.data)
        const slice = r.data.slice(0, contadorPagina);
        setMensagensRecebidas(slice)
      })
  }

  const trocarPagina = () => {
    setTimeout(function () {
      setContadorPagina(contadorPagina + 2)
      const slice = total.slice(0, contadorPagina);
      setMensagensRecebidas(slice)
    }, 1000);
  }

  const tratarData = (e) => {
    var dataAtual = new Date()
    var dataAnterior = new Date(e)
    var tempo = dataAtual.getTime() - dataAnterior.getTime()
    var diferenca = tempo / (1000 * 3600 * 24);
    if (diferenca >= 2) {
      return parseInt(diferenca) + " dias"
    }
    return parseInt(diferenca = tempo / (1000 * 3600)) + " horas";
  }

  const responderMensagem = async (e) => {
    var request = {
      men_resposta: mensagem,
      men_id: e.target.id
    }
    await api.post("/alterarMensagem", (request))
      .then(r => {
        notificar(r.data)
        history.push("/Mensagens")
      })
  }

  return (
    <>
      <Cabecalho />
      <Container className="justify-content-center margem-s pt-1 pb-4 p-0">
        <Row className="justify-content-center p-0 m-0" >
          <Row className="p-0 m-0" style={{ maxWidth: "850px" }} >
            <InfiniteScroll
              className="p-0 m-0"
              pageStart={0}
              loadMore={trocarPagina}
              hasMore={mensagensRecebidas.length === total.length ? false : true}
              loader={<h5 key="carregando" className="text-center pt-4">Carregando...</h5>}
            >
              <MenBarraNav
                abaMensagensRec={abaMensagensRec}
                setAbaMensagensRec={setAbaMensagensRec}
                abaMensagensEnv={abaMensagensEnv}
                setAbaMensagensEnv={setAbaMensagensEnv}
              />
              <Row
                className="justify-content-center m-1 p-4 mt-0"
                style={{
                  backgroundColor: "white",
                  zIndex: 4,
                  border: "1px solid #dee2e6",
                  borderTop: "1px solid white",
                }}
              >
                {total.length === 0 &&
                  <Row className="justify-content-center text-center p-0 m-0 pt-5 pb-5" >
                    <h5>Voc?? ainda n??o recebeu perguntas</h5>
                  </Row>
                }
                {mensagensRecebidas.map(item =>
                  <Row key={item.men_id}
                    className="justify-content-center ms-0 me-0 p-0 mb-5"
                    style={estilos.gridMensagens}
                  >
                    <Row className="m-0 p-0" style={{ borderBottom: "1px solid #eaeaea" }}>
                      <Col xs="auto" className="d-flex align-self-start p-0 m-0">
                        <a className="p-0" href={`/Anuncio/${item.anu_id}`}><img style={{ padding: 5, width: 55, height: 55, objectFit: "cover" }} src={`${process.env.REACT_APP_BACKEND}/images/${item.anu_foto_capa}`} alt=""></img></a>
                      </Col>
                      <Col xs="" className="d-flex align-self-center text-start p-2" >
                        <a className="p-0" href={`/Anuncio/${item.anu_id}`}>{item.anu_titulo}</a>
                      </Col>
                    </Row>
                    <Row className="justify-content-center">
                      <Row className=" p-3 ms-3 m3-3">
                        <Row style={{ fontSize: "0.7rem" }}>
                          <div className="p-0">
                            <b>Enviada por {item.usu_nome}</b> h?? {tratarData(item.men_enviada_data)}
                          </div>
                        </Row>
                        <Row >{item.men_enviada}</Row>
                        <Row className="ps-0 pe-0 pt-2">
                          <FormGroup>
                            {item.men_resposta === null &&
                              <Input type="textarea" value={item.men_resposta} onChange={(e) => setMensagem(e.target.value)} />
                            }
                            {item.men_resposta !== null &&
                              <Input disabled type="textarea" value={item.men_resposta} onChange={(e) => setMensagem(e.target.value)} />
                            }
                          </FormGroup>
                        </Row>
                        {item.men_resposta_data &&
                          <Row style={{ fontSize: "0.7rem", textAlign: "end" }}>
                            <div className="p-0">
                              <b>Respondida por Voc??</b> h?? {tratarData(item.men_resposta_data)}
                            </div>
                          </Row>
                        }
                        <Row className="pt-2 d-flex flex-row-reverse">
                          {item.men_resposta === null &&
                            <Button id={item.men_id} style={{ width: "150px" }} onClick={e => responderMensagem(e)}>Responder</Button>
                          }
                        </Row>
                      </Row>
                    </Row>
                  </Row>
                )}
              </Row>
            </InfiniteScroll>
          </Row>
        </Row>
      </Container>
    </>
  )
}