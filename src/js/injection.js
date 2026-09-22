async function injectionHeader() {
    const response = await fetch("./src/components/navBar/navbar.html");
    const headerHtml = await response.text();
    document.getElementById("header").innerHTML = headerHtml;
}

injectionHeader();