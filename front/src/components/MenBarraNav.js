import React from 'react';
import { useHistory } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const MenBarraNav = (props) => {

  const history = useHistory()

  return (
    <div>
      <Nav className="m-1 mb-0" tabs  >
        <NavItem>
          <NavLink
            href="#"
            active={props.abaMensagensRec}
            onClick={() => history.push("/MensagensRecebidas")}
          >
            Mensagens Recebidas
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            active={props.abaMensagensEnv}
            onClick={() => history.push("/MensagensEnviadas")}
          >
            Mensagens Enviadas
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}

export default MenBarraNav;