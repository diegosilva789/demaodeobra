import React, { useEffect, useState } from 'react';
import { Row, Container } from "reactstrap";
import Cabecalho from '../components/Cabecalho';
import estilos from "../styles/estilos-js"
import api from "../service/api"
import { useHistory, useParams } from 'react-router-dom';

export default function AtivarUsuario() {

  const [mensagem, setMensagem] = useState("")

  const { email } = useParams()

  const history = useHistory()

  useEffect(() => {
    ativarUsuario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ativarUsuario = async () => {
    await api(`/ativarUsuario/${email}`)
      .then(r => {
        console.log(r.data.message)
        setMensagem(r.data.message)
        setTimeout(function () {
          history.push('/Login');
        }, 5000);
      })
      .catch(e => {
        console.log(e.response.data)
        setMensagem(e.response.data)
        setTimeout(function () {
          history.push('/Login');
        }, 5000);
      })
  }

  return (
    <>
      <Cabecalho />
      <div>
        <Container className="justify-content-center" style={estilos.login}>
          <Row className="p-1 pt-5 justify-content-center" style={estilos.gridAtivacao}>
            <Row className="p-0 pb-3 m-1 justify-content-center h3">Ativação do Cadastro</Row>
            <Row className="p-3 pb-5 mb-1 justify-content-center">
              <p>{mensagem}, <a href="/Login" style={{ color: "#136BA4", fontWeight: "bold" }}>clique aqui</a> para ir à página de login ou aguarde o redirecionamento.</p>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  )
}