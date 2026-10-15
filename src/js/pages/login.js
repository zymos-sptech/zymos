window.passwordVisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "block";
  iconInvisible.style.display = "none";
  inputPassword.type = "text";
};

window.passwordInvisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "none";
  iconInvisible.style.display = "block";
  inputPassword.type = "password";
};
