const year = document.querySelector("#year");

const today = new Date();

year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Site-wide: active nav + theme
function setActiveNav() {
    const page = document.body.dataset.page;
    $$('nav [data-nav]').forEach(a => {
        if (a.getAttribute('data-nav') === page) {
            a.setAttribute('aria-current', 'page');
        } else {
            a.removeAttribute('aria-current');
        }
    });
}
function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
        document.documentElement.dataset.theme = saved;
    }
}
function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    const btn = $("#themeToggle");
    if (btn) { btn.setAttribute("aria-pressed", String(next === "dark")); }
}

// Progressive reveal for nice UX
function setupReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("reveal");
                obs.unobserve(e.target);
            }
        });
    }, { rootMargin: "100px" });
    $$(".card, .features article, .hero").forEach(el => obs.observe(el));
}

// Newsletter form (Home)
function setupNewsletter() {
    const form = $("#newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = $("#email").value.trim();
        const experience = $("#experience").value;
        const msg = $("#formMsg");

        // Very simple validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            msg.textContent = "Please enter a valid email address.";
            msg.className = "error";
            return;
        }
        if (!experience) {
            msg.textContent = "Please tell us your riding experience.";
            msg.className = "error";
            return;
        }
        // Save to localStorage (mock subscribe)
        const subs = JSON.parse(localStorage.getItem("subscribers") || "[]");
        const record = { email, experience, ts: Date.now() };
        subs.push(record);
        localStorage.setItem("subscribers", JSON.stringify(subs));
        msg.textContent = `Thanks! We just saved your subscription for ${email}.`;
        msg.className = "success";
        form.reset();
    });
}

// Bikes page dynamic list
const bikes = [
    { id: "ak-commuter", name: "Akwaaba Commuter", price: 9500, range: 60, terrain: "city", badges: ["Lightweight", "Great value"] },
    { id: "legon-climber", name: "Legon Climber", price: 18500, range: 90, terrain: "hills", badges: ["Torque sensor", "Hill beast"] },
    { id: "osu-cruiser", name: "Osu Cruiser", price: 12500, range: 70, terrain: "mixed", badges: ["Comfort seat", "Rack included"] },
    { id: "labadi-longrange", name: "Labadi Long-Range", price: 23500, range: 120, terrain: "mixed", badges: ["Big battery", "Hydraulic brakes"] },
    { id: "ringroad-sprinter", name: "Ring Road Sprinter", price: 20500, range: 75, terrain: "city", badges: ["Fast accel", "Urban pro"] }
];

function ghc(n) { return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(n); }

function renderBikes(items) {
    const list = $("#bikeList");
    if (!list) return;
    list.innerHTML = items.map(b => `
    <article class="card" data-id="${b.id}">
      <h3>${b.name}</h3>
      <p class="price">${ghc(b.price)}</p>
      <p><span class="badge">${b.terrain}</span> • Range: <strong>${b.range} km</strong></p>
      <p>${b.badges.map(x => `<span class="badge">${x}</span>`).join(" ")}</p>
      <div class="card-actions">
        <button class="btn" data-action="save">Save</button>
        <button class="btn btn-ghost" data-action="details">Details</button>
      </div>
    </article>
  `).join("");
}
function setupBikeFilters() {
    const terrain = $("#terrain"); const budget = $("#budget"); const sort = $("#sort");
    const apply = () => {
        let items = [...bikes];
        // Filter by terrain
        if (terrain.value !== "all") {
            items = items.filter(b => b.terrain === terrain.value);
        }
        // Budget filtering (conditional branching)
        if (budget.value === "lt10000") { items = items.filter(b => b.price < 10000); }
        else if (budget.value === "10k-20k") { items = items.filter(b => b.price >= 10000 && b.price <= 20000); }
        else if (budget.value === "gt20000") { items = items.filter(b => b.price > 20000); }

        // Sorting
        items.sort((a, b) => {
            if (sort.value === "price") return a.price - b.price;
            if (sort.value === "range") return b.range - a.range;
            return a.name.localeCompare(b.name);
        });
        renderBikes(items);
    };
    [terrain, budget, sort].forEach(sel => sel && sel.addEventListener("change", apply));
    apply();

    // Card actions (event delegation)
    const list = $("#bikeList");
    if (list) {
        list.addEventListener("click", e => {
            const btn = e.target.closest("button");
            if (!btn) return;
            const card = e.target.closest(".card");
            const id = card?.dataset.id;
            const item = bikes.find(b => b.id === id);
            if (!item) return;
            if (btn.dataset.action === "save") {
                const favs = JSON.parse(localStorage.getItem("favs") || "[]");
                if (!favs.find(x => x.id === item.id)) {
                    favs.push(item);
                    localStorage.setItem("favs", JSON.stringify(favs));
                    renderFavs();
                }
            } else if (btn.dataset.action === "details") {
                alert(`${item.name}\nTerrain: ${item.terrain}\nRange: ${item.range} km\nPrice: ${ghc(item.price)}`);
            }
        });
    }
}
function renderFavs() {
    const wrap = $("#favourites");
    if (!wrap) return;
    const favs = JSON.parse(localStorage.getItem("favs") || "[]");
    if (favs.length === 0) {
        wrap.innerHTML = `<p class="note">No saved bikes yet.</p>`;
        return;
    }
    wrap.innerHTML = favs.map(f => `
    <article class="card">
      <h3>${f.name}</h3>
      <p class="price">${ghc(f.price)}</p>
      <button class="btn btn-ghost" data-remove="${f.id}">Remove</button>
    </article>
  `).join("");
}
function setupFavs() {
    const btn = $("#clearFavs");
    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.removeItem("favs");
            renderFavs();
        });
    }
    const wrap = $("#favourites");
    if (wrap) {
        wrap.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-remove]");
            if (!btn) return;
            const id = btn.getAttribute("data-remove");
            const favs = JSON.parse(localStorage.getItem("favs") || "[]").filter(x => x.id !== id);
            localStorage.setItem("favs", JSON.stringify(favs));
            renderFavs();
        });
        renderFavs();
    }
}

// Community page: events and rentals from objects
const events = [
    { date: "2025-08-23", title: "Saturday Sunrise Ride", location: "Labadi Beach", pace: "easy" },
    { date: "2025-09-06", title: "Legon Hill Climbs", location: "UG Campus", pace: "moderate" },
    { date: "2025-09-20", title: "Osu Night Cruise", location: "Oxford Street", pace: "fast" }
];
const rentals = [
    { name: "Kwame's e-Bike Rentals", phone: "+233 20 000 0001", area: "Osu" },
    { name: "GreenRide Ghana", phone: "+233 24 000 0002", area: "East Legon" },
    { name: "Coastline E-Mobility", phone: "+233 54 000 0003", area: "Labadi" }
];

function renderEvents() {
    const ul = $("#eventsList");
    if (!ul) return;
    ul.innerHTML = events
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(e => `<li class="card"><strong>${e.title}</strong> <span class="badge">${e.pace}</span><div>${new Date(e.date).toLocaleDateString()}</div><div>${e.location}</div></li>`)
        .join("");
}
function renderRentals() {
    const ul = $("#rentalPartners");
    if (!ul) return;
    ul.innerHTML = rentals
        .map(r => `<li class="card"><strong>${r.name}</strong><div>${r.area}</div><a class="btn btn-ghost" href="tel:${r.phone.replace(/\s/g, '')}">Call</a></li>`)
        .join("");
}

// Contact form
function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const msg = $("#contactMsg");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (!data.name || !data.email || !data.message || !data.pace) {
            msg.textContent = "Please complete all fields.";
            msg.className = "error";
            return;
        }
        // Save to localStorage
        const inbox = JSON.parse(localStorage.getItem("messages") || "[]");
        inbox.push({ ...data, ts: Date.now() });
        localStorage.setItem("messages", JSON.stringify(inbox));
        msg.textContent = `Thanks, ${data.name}! We received your message and will reply via ${data.email}.`;
        msg.className = "success";
        form.reset();
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    setActiveNav();
    setupReveal();
    setupNewsletter();
    setupBikeFilters();
    setupFavs();
    renderEvents();
    renderRentals();
    setupContactForm();

    const themeBtn = $("#themeToggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
        themeBtn.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));
    }
});
