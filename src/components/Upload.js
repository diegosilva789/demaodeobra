import React, { useContext, useEffect } from 'react';
import { Uploader } from 'rsuite';
import "rsuite/dist/styles/rsuite-default.css";
import Contexto from '../Contexto';

export default function App(props) {

  const { fileList } = useContext(Contexto);

  useEffect(() => {
    console.log("LISTA ANTERIOR", fileList)
    console.log("LISTA DE ADICIONADOS", props.fotosAdicionadas)
    console.log("LISTA ATUAL", props.fotosAtuais)
    console.log("LISTA DE REMOVIDOS", props.fotosRemovidas)
    console.log(props.deletou)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fotosAtuais, fileList, props.fotosAdicionadas, props.fotosRemovidas])

  const instanceUploader = {
    name: 'filetoupload',
    listType: "picture",
    multiple: true,
    action: process.env.REACT_APP_BACKEND + "/uploadFile",
    onSuccess(response) {
      props.setFotosAdicionadas([...props.fotosAdicionadas, response.data])
    },
    onRemove(response) {
      console.log(response)
      props.setFotosRemovidas([...props.fotosRemovidas, response])
      props.setDeletou(props.deletou + 1)
    }
  }

  return (
    <div>
      <Uploader className="m-0"
        {...instanceUploader}
        defaultFileList={fileList}
        disabled={props.fotosAtuais.length > 4}
        onChange={props.setFotosAtuais}
      />
    </div>
  );
}