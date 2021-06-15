import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Container, Row, Button, Form,
  DropdownToggle, DropdownMenu, DropdownItem,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  FormGroup, Input, InputGroup,
  InputGroupAddon
} from "reactstrap";
import estilos from "../styles/estilos-js"
import api from "../service/api"

export default function Cabecalho(props) {

  const [nome, setNome] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [buscar, setbuscar] = useState(props.resultado || "")
  const [autenticou, setAutenticou] = useState(false)
  const [estado] = useState(0)

  const history = useHistory()

  const toggleNav = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      obterUsuarioPorUsu_id()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const obterUsuarioPorUsu_id = async () => {
    await api.post("/obterUsuarioPorUsu_id")
      .then(r => {
        setAutenticou(true)
        setNome(r.data[0].usu_nome.split(" ")[0])
      })
  };

  return (
    <>
      <div className="position-fixed w-100" style={estilos.cabecalho}>
        <Container className="ps-1 pe-1" >
          <Navbar light expand="md" style={{ backgroundColor: "#BCFD5E", marginRight: "auto", marginLeft: "auto" }}>
            <NavbarBrand href="/">demaodeobra</NavbarBrand>
            <NavbarToggler onClick={toggleNav} />
            <Collapse isOpen={isOpen} navbar className="justify-content-end">
              <Row className="w-100 d-none d-md-block">
                <Form onSubmit={(e) => { history.push(`/Resultado/${buscar}`) }}>
                  <FormGroup className="w-100" >
                    <InputGroup >
                      <Input style={estilos.input} value={buscar} onChange={e => setbuscar(e.target.value)} />
                      <InputGroupAddon addonType="append">
                        <Button className="" type="submit">
                          Buscar
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </Row>
              <Nav className="mr-auto" navbar >
                <NavItem>
                  <NavLink href="/Mensagens">Mensagens</NavLink>
                </NavItem>
                {autenticou === false &&
                  <NavItem>
                    <NavLink href="/Login">Login</NavLink>
                  </NavItem>
                }
                {autenticou !== false &&
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret style={{ fontWeight: "bold" }}>
                      {nome}
                    </DropdownToggle  >
                    <DropdownMenu>
                      <Link to="/Mensagens" style={estilos.link}>
                        <DropdownItem className="d-block d-sm-none">Mensagens</DropdownItem>
                      </Link>
                      <Link to="/CadastrarAnuncio" style={estilos.link}>
                        <DropdownItem>Cadastrar novo Anúncio</DropdownItem>
                      </Link>
                      <Link to="/MeusDados" style={estilos.link}>
                        <DropdownItem >Meus Dados</DropdownItem>
                      </Link>
                      <Link to="/MeusAnuncios" style={estilos.link}>
                        <DropdownItem >Meus Anúncios</DropdownItem>
                      </Link>
                      <DropdownItem divider />

                      <DropdownItem onClick={() => { localStorage.clear(); window.location.href = '/' }
                      }
                        style={estilos.link}>Sair</DropdownItem>

                    </DropdownMenu>
                  </UncontrolledDropdown>
                }
                <NavItem>
                  <NavLink href="/CadastrarUsuario" className="pe-0" onClick={() =>
                    localStorage.clear()
                  }
                  >
                    Cadastrar
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <Row className="w-100 d-block d-xs-none d-sm-block d-md-none pb-3 ms-0 me-0">
            <Form className="p-0" onSubmit={(e) => { history.push(`/Resultado/${buscar}`) }}>
              <FormGroup className="w-100 ps-0 pe-0">
                <InputGroup >
                  <Input value={buscar} onChange={e => setbuscar(e.target.value)} style={estilos.input} />
                  <InputGroupAddon addonType="append" >
                    <Button >
                      Buscar
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
          </Row>
        </Container>
      </div>
    </>
  )
}

