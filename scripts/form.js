document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

const products = [
    { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
    { id: "fc-2050", name: "power laces", averagerating: 4.7 },
    { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
    { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
    { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];

const features = ["Durability", "Ease of Use", "Design", "Performance"];

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

function createRatingOptions() {
    const ratingDiv = document.getElementById("rating");

    for (let i = 1; i <= 5; i++) {
        const label = document.createElement("label");
        label.textContent = `${i} `;
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "rating";
        input.id = `rating${i}`;
        input.value = i;
        input.required = true;
        ratingDiv.appendChild(input);
        ratingDiv.appendChild(label);
    }
}

function createFeatureOptions() {
    const featuresDiv = document.getElementById("features");

    features.forEach(feature => {
        const label = document.createElement("label");
        label.textContent = feature;
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "features";
        input.value = feature;
        input.id = `feature-${feature}`;
        featuresDiv.appendChild(input);
        featuresDiv.appendChild(label);
        featuresDiv.appendChild(document.createElement("br"));
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const reviewCount = localStorage.getItem("reviewCount") || 0;
    localStorage.setItem("reviewCount", parseInt(reviewCount) + 1);

    window.location.href = "review.html";
}

function initForm() {
    populateProductOptions();
    createRatingOptions();
    createFeatureOptions();

    const form = document.getElementById("reviewForm");
    form.addEventListener("submit", handleFormSubmit);
}

window.onload = initForm;
