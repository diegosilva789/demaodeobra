import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Row, Label, Input,
} from 'reactstrap';
import api from "../service/api"
import notificar from './Notificar';

export default function EnviarMensagem(props) {

  const [modal, setModal] = useState(false);
  const [mensagem, setMensagem] = useState("")

  const history = useHistory()

  const toggleModal = () => {
    if (localStorage.getItem("token")) {
      setModal(!modal)
    } else {
      history.push("/Login")
    }
  }

  const tratarTexto = (e) => {
    if (e.key === "Enter") {
      setMensagem(e.target.value + "\n")
    }
    setMensagem(e.target.value)
  }

  const enviarMensagem = async () => {
    var request = {
      usu_id_men_enviada: props.usuarioRemetenteId,
      men_enviada: mensagem,
      anu_id: props.anuncioId,
      usu_id_men_resposta: props.usuarioRespostaId
    }
    await api.post("/inserirMensagem", (request))
      .then(r => {
        notificar(r.data)
        toggleModal()
      })
  }

  return (
    <div className="">
      <Row className="ms-auto me-auto pt-2 pb-2">
        <Button size="lg" onClick={toggleModal}>Enviar Mensagem</Button>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal} backdrop="static" keyboard={false} >
        <ModalHeader>Mande a sua mensagem</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="exampleText">Escreva a sua mensagem e clique em enviar:</Label>
            <Input type="textarea" name="text" id="textArea" onKeyUp={e => tratarTexto(e)} />
          </FormGroup>
          {mensagem !== "" &&
            <Row className="p-4 pb-3" style={{ whiteSpace: "pre-wrap" }}>{mensagem}</Row>
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => enviarMensagem()}>Enviar</Button>{' '}
          <Button onClick={toggleModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}