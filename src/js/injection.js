async function injectionHeader() {
    const response = await fetch("./src/components/nav-bar/navbar.html");
    const headerHtml = await response.text();
    document.getElementById("header").innerHTML = headerHtml;
}

injectionHeader();