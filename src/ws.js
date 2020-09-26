// TODO: get host from env vars
// TODO: add toggle for working with localhost
import Convert from "ansi-to-html";

document.getElementById("form").addEventListener("submit", main);

function main(e) {
  e.preventDefault();

  const sessionInput = document.getElementById("session");
  const id = sessionInput.value;

  connect(id);
}

let socket;

function connect(sessionId) {
  const url = wsUrl(sessionId);
  if (socket) {
    socket.close();
  }
  socket = new WebSocket(url);

  const handleMessage = makeHandleMessage(new Convert({ stream: false }));

  socket.onopen = handleOpen;
  socket.onmessage = handleMessage;
  socket.onclose = handleClose;
  socket.onerror = handleError;

  const output = document.getElementById("output");
  output.innerHTML = "";

  removeAlert();
}

function wsUrl(sessionId) {
  const isLocalhost = location.host.match("localhost");
  const protocol = isLocalhost ? "ws" : "w";
  const host = isLocalhost ? "localhost:9000" : "webout.xyz";

  return `${protocol}://${host}/api/session/ws/${sessionId}`;
}

function handleError(_error) {
  addAlert("There was an error with the socket connection.");

  window.scrollTo({ top: 0, behavior: "instant" });
}

function handleClose(_closeEvent) {
  addAlert("This session is closed!");

  window.scrollTo({ top: 0, behavior: "instant" });
}

function handleOpen(_openEvent) {
  addAlert("Connected to session!!!");

  setTimeout(removeAlert, 5 * 1000);
}

const makeHandleMessage = (convert) => {
  function handleMessage(msgEvent) {
    const output = document.getElementById("output");

    output.innerHTML = `${output.innerHTML}${convert.toHtml(msgEvent.data)}`;
    window.scrollTo({ top: output.clientHeight, behavior: "instant" });
  }

  return handleMessage;
};

function addAlert(msg) {
  const alert = document.getElementById("alert");
  alert.innerHTML = msg;
  alert.classList.remove("hidden");
  alert.classList.add("alert");
}

function removeAlert() {
  const alert = document.getElementById("alert");
  alert.innerHTML = "";
  alert.classList.remove("alert");
  alert.classList.add("hidden");
}
