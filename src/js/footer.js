async function injectionFooter() {
  const response = await fetch("./src/components/footer/footer.html");
  const footer = await response.text();
  document.getElementById("footer").innerHTML = footer;
}

injectionFooter();