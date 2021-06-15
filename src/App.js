import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './routes/Home';
import CadastrarUsuario from './routes/CadastrarUsuario';
import CadastrarAnuncio from './routes/CadastrarAnuncio';
import AlterarAnuncio from './routes/AlterarAnuncio';
import AlterarUsuario from './routes/AlterarUsuario';
import Login from './routes/Login';
import Anuncio from './routes/Anuncio';
import MeusDados from './routes/MeusDados';
import MeusAnuncios from './routes/MeusAnuncios';
import AtivarUsuario from './routes/AtivarUsuario';
import MensagensEnviadas from './routes/MensagensEnviadas';
import MensagensRecebidas from './routes/MensagensRecebidas';
import Resultado from './routes/Resultado';
import Contexto from './Contexto';
import PrivateRoute from './components/PrivateRoute';

export default function App() {

  const [estado] = useState(0);
  const [anuncioId, setAnuncioId] = useState(0);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    console.log(
      `%c
 _____                       _______                     
|_   _|                     |__   __|                    
  | |_   _____  _ __ _   _     | | _____      _____ _ __ 
  | \\ \\ / / _ \\| '__| | | |    | |/ _ \\ \\ /\\ / / _ \\ '__|
 _| |\\ V / (_) | |  | |_| |    | | (_) \\ V  V /  __/ |   
|_____\\_/ \\___/|_|   \\__, |    |_|\\___/ \\_/\\_/ \\___|_|   
                      __/ |                              
                     |___/                                
`, "font-family:monospace; color:blue"
    )
  }, [estado])

  return (
    <>
      <Contexto.Provider value={{
        anuncioId, setAnuncioId,
        fileList, setFileList,
      }}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact={true} render={() => (<Home />)} />
            <Route path="/CadastrarUsuario" exact={true} render={() => (<CadastrarUsuario />)} />
            <Route path="/Login" exact={true} render={() => (<Login />)} />
            <Route path="/Anuncio/:id" exact={true} render={() => (<Anuncio />)} />
            <Route path="/Resultado/:palavras" exact={true} render={() => (<Resultado />)} />
            <Route path="/AtivarUsuario/:email" exact={true} render={() => (<AtivarUsuario />)} />
            <PrivateRoute path="/CadastrarAnuncio" exact={true} component={CadastrarAnuncio} />
            <PrivateRoute path="/AlterarAnuncio" exact={true} component={AlterarAnuncio} />
            <PrivateRoute path="/AlterarUsuario" exact={true} component={AlterarUsuario} />
            <PrivateRoute path="/Mensagens" exact={true} component={MensagensRecebidas} />
            <PrivateRoute path="/MeusDados" exact={true} component={MeusDados} />
            <PrivateRoute path="/MeusAnuncios" exact={true} component={MeusAnuncios} />
            <PrivateRoute path="/MensagensRecebidas" exact={true} component={MensagensRecebidas} />
            <PrivateRoute path="/MensagensEnviadas" exact={true} component={MensagensEnviadas} />
          </Switch>
        </BrowserRouter>
      </Contexto.Provider>
    </>
  );
}