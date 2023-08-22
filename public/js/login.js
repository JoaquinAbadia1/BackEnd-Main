async function postLogin(username, password) {
  const response = await fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  return result;
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  postLogin(username, password).then((datos) => console.log(datos));
});

async function postSignup(username, password, email, age) {
  const data = { username, password, email, age };
  console.log(data);
  const response = await fetch("/api/sessions/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  postSignup(username, password, email, age).then((datos) =>
    console.log(datos)
  );
});
