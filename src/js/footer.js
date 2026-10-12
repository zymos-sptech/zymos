async function injectionFooter() {
  const isSubdir = window.location.pathname.includes("/pages/");
  const path = isSubdir
    ? "../components/footer/footer.html"
    : "./src/components/footer/footer.html";
  try {
    const response = await fetch(path);
    if (response.ok) {
      const footer = await response.text();
      const el = document.getElementById("footer");
      if (el) el.innerHTML = footer;
    }
  } catch (err) {
    console.error("Erro ao injetar footer:", err);
  }
}

injectionFooter();