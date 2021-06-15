import { Notification } from 'rsuite';

function notificar(mensagem) {
  Notification.open({
    title: 'demaodeobra',
    placement: "bottomEnd",
    duration: 3000,
    description: <p style={{ marginBottom: "4px" }}>{mensagem}</p>
  });
}

export default notificar