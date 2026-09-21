async function injectionHeader() {
    const response = await fetch("./src/components/navbar.html");
    const headerHtml = await response.text();
    document.getElementById("header").innerHTML = headerHtml;
}

injectionHeader();