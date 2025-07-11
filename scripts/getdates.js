const year = document.querySelector("#year");

const today = new Date();

year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;


const modifiedElement = document.getElementById("lastModified");

let oLastModif = new Date(document.lastModified);
const formattedDate = oLastModif.toLocaleString();

if (modifiedElement) {
    modifiedElement.textContent = `Last Modification: ${formattedDate}`;
}