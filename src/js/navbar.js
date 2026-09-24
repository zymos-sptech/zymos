async function injectionHeader() {
  const response = await fetch("./src/components/nav-bar/navbar.html");
  const headerHtml = await response.text();
  document.getElementById("header").innerHTML = headerHtml;
}

window.menuOpen = function () {
  let menu = document.getElementById("menu-mobile");
  menu.style.display = "flex";
};

window.menuClose = function () {
  let menu = document.getElementById("menu-mobile");
  menu.style.display = "none";
};

injectionHeader();
