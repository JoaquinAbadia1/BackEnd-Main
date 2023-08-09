const socketio = io();

let user;

let chatBox = document.getElementById("chatBox");
let boton = document.getElementById("boton");

const { value: email } = Swal.fire({
  title: "Mail que aparecera en el chat",
  input: "email",
  inputLabel: "Ingresa el correo electronico para poder ingresar al chat",
  inputPlaceholder: "Ingresa tu correo",
  allowOutsideClick: false,
}).then((email) => {
  if (email.value) {
    user = Swal.fire(`Entered email: ${email.value}`);
    user = email.value;
  }
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socketio.emit("message", {
        user: user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

socketio.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let message = "";

  data.forEach((elem) => {
    message += `
       
          <div class="chat-message">
          <div class="message-bubble">
    
            <div class="message-sender">${elem.user}</div>
            <p>${elem.message}</p>
            </div>
    
          </div>
        `;
  });

  log.innerHTML = message;
});

socketio.on("new-user-connected", (data) => {
  if (data.id !== socketio.id)
    Swal.fire({
      text: `${data.user} se ha conectado al chat`,
      toast: true,
      position: "top-end",
    });
});
