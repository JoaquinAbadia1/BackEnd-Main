async function postLogin(username, password) {
  const response = await fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  console.log("Bienvenido " + username);
  return result;
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const token = localStorage.getItem("token");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  localStorage.setItem("token", token);

  console.log(token);
  postLogin(username, password);
});
