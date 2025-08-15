
const products = [
    { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
    { id: "fc-2050", name: "power laces", averagerating: 4.7 },
    { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
    { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
    { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];

function populateProductOptions() {
    const productSelect = document.getElementById("product");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Select a Product ...";
    productSelect.appendChild(defaultOption);

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} (Avg. Rating: ${product.averagerating})`;
        productSelect.appendChild(option);
    });
}

function updateStarColors() {
    const ratingDiv = document.getElementById("rating");
    const radioButtons = ratingDiv.querySelectorAll('input[type="radio"]');
    const labels = ratingDiv.querySelectorAll('label');

    radioButtons.forEach((radio, index) => {
        if (radio.checked) {

            labels[index].style.color = "#ffb74d";
        } else {

            labels[index].style.color = "#ccc";
        }
    });
}

function createRatingOptions() {
    const ratingDiv = document.getElementById("rating");

    ratingDiv.innerHTML = '';

    const numberOfStars = 5;

    for (let i = 1; i <= numberOfStars; i++) {
        const input = document.createElement("input");
        input.type = "radio";
        input.id = `rating${i}`;
        input.name = "rating";
        input.value = i;
        input.required = true;

        const label = document.createElement("label");
        label.setAttribute("for", `rating${i}`);
        label.textContent = "☆";

        ratingDiv.appendChild(input);
        ratingDiv.appendChild(label);


        ratingDiv.appendChild(document.createTextNode(" "));
    }


    const radioButtons = ratingDiv.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            updateStarColors();
        });
    });
}


function initForm() {
    populateProductOptions();
    createRatingOptions();

    updateStarColors();

    const form = document.getElementById("reviewForm");
    form.addEventListener("submit", handleFormSubmit);
}


function handleFormSubmit(event) {
    event.preventDefault();

    alert("Review submitted successfully!");
}


function setFooterYear() {
    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();
}


function setLastModifiedDate() {
    const lastModifiedSpan = document.getElementById("lastModified");
    lastModifiedSpan.textContent = document.lastModified;
}

window.onload = function () {
    initForm();
    setFooterYear();
    setLastModifiedDate();
};
