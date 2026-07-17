// =====================================================
// Vamshi's Tasteuraa
// app.js
// =====================================================

let allProducts = [];
let filteredProducts = [];

// Emoji icons by category
const categoryIcons = {
    "Ice Creams": "🍨",
    "Scoops": "🍦",
    "Ice Cream Boxes": "🍧",
    "Milk Shakes": "🥤",
    "Thick Shakes": "🥛",
    "Boba Shakes": "🧋",
    "Boba Coolers": "🧋",
    "Mojitos": "🍹",
    "French Fries": "🍟",
    "Veg Bites": "🥟",
    "Non Veg Bites": "🍗",
    "Momos": "🥟",
    "Burgers": "🍔",
    "Maggi": "🍜",
    "Specials": "⭐"
};

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    const search = document.getElementById("search");

    if (search) {

        search.addEventListener("input", function () {

            const keyword = this.value.toLowerCase();

            filteredProducts = allProducts.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );

            renderProducts(filteredProducts);

        });

    }

});

async function loadProducts() {

    try {

        const response = await fetch("data/products.json");

        allProducts = await response.json();

        filteredProducts = [...allProducts];

        createCategoryButtons();

        renderProducts(filteredProducts);

    } catch (error) {

        console.error("Unable to load products.json", error);

    }

}

function createCategoryButtons() {

    const container = document.getElementById("categories");

    if (!container) return;

    container.innerHTML = "";

    const categories = [...new Set(allProducts.map(p => p.category))];

    // ALL button

    const allBtn = document.createElement("button");

    allBtn.className = "category-btn active";

    allBtn.innerText = "🍽️ All";

    allBtn.onclick = () => {

        document.querySelectorAll(".category-btn")
            .forEach(btn => btn.classList.remove("active"));

        allBtn.classList.add("active");

        filteredProducts = [...allProducts];

        renderProducts(filteredProducts);

    };

    container.appendChild(allBtn);

    // Dynamic buttons

    categories.forEach(category => {

        const btn = document.createElement("button");

        btn.className = "category-btn";

        btn.innerHTML = `${categoryIcons[category] || "🍴"} ${category}`;

        btn.onclick = () => {

            document.querySelectorAll(".category-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            filteredProducts = allProducts.filter(p => p.category === category);

            renderProducts(filteredProducts);

        };

        container.appendChild(btn);

    });

}
// =====================================================
// Render Products
// =====================================================

function renderProducts(products) {

    const container = document.getElementById("category-products");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {

        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <h2>No Products Found 😔</h2>
            </div>
        `;

        return;
    }

    // Group by category

    const grouped = {};

    products.forEach(product => {

        if (!grouped[product.category]) {

            grouped[product.category] = [];

        }

        grouped[product.category].push(product);

    });

    Object.keys(grouped).forEach((category, index) => {

        const card = document.createElement("div");

        card.className = "category-card";

        const bodyId = "cat_" + index;

        card.innerHTML = `

        <div class="category-header">

            <h3>

                ${categoryIcons[category] || "🍴"} ${category}

            </h3>

            <span class="toggle-btn">

                +

            </span>

        </div>

        <div
            class="category-products"
            id="${bodyId}">

        </div>

        `;

        container.appendChild(card);

        const header = card.querySelector(".category-header");

        const body = card.querySelector(".category-products");

        const toggle = card.querySelector(".toggle-btn");

        header.addEventListener("click", () => {

            document.querySelectorAll(".category-products")
                .forEach(section => {

                    if (section !== body) {

                        section.classList.remove("open");

                    }

                });

            document.querySelectorAll(".toggle-btn")
                .forEach(btn => {

                    if (btn !== toggle) {

                        btn.innerHTML = "+";

                    }

                });

            body.classList.toggle("open");

            toggle.innerHTML = body.classList.contains("open")
                ? "−"
                : "+";

        });

        grouped[category].forEach(product => {

            body.appendChild(createProductCard(product));

        });

    });

    // Open first category automatically

    const first = document.querySelector(".category-products");

    const firstToggle = document.querySelector(".toggle-btn");

    if (first) {

        first.classList.add("open");

    }

    if (firstToggle) {

        firstToggle.innerHTML = "−";

    }

}

// =====================================================
// Product Card
// =====================================================

function createProductCard(product) {

    const card = document.createElement("div");

    card.className = "product-card";

    const icon = categoryIcons[product.category] || "🍽️";

    let priceHTML = "";

    // Products with Regular & Large

    if (product.regular && product.large) {

        priceHTML = `

        <div class="product-price">

            <span>

                Regular

            </span>

            <strong>

                ₹${product.regular}

            </strong>

        </div>

        <button
            class="add-btn"
            onclick="addItem('${product.name}','Regular',${product.regular})">

            Add Regular

        </button>

        <div class="product-price">

            <span>

                Large

            </span>

            <strong>

                ₹${product.large}

            </strong>

        </div>

        <button
            class="add-btn"
            onclick="addItem('${product.name}','Large',${product.large})">

            Add Large

        </button>

        `;

    }

    // Single price products

    else {

        const price = product.price || product.single;

        priceHTML = `

        <div class="product-price">

            <span>

                Price

            </span>

            <strong>

                ₹${price}

            </strong>

        </div>

        <button
            class="add-btn"
            onclick="addItem('${product.name}','Regular',${price})">

            Add to Cart

        </button>

        `;

    }

    card.innerHTML = `

        <div class="product-image">

            ${icon}

        </div>

        <div class="product-name">

            ${product.name}

        </div>

        ${priceHTML}

    `;

    return card;

}
// =====================================================
// Helpers
// =====================================================

function getProductByName(name) {

    return allProducts.find(product => product.name === name);

}

function scrollToMenu() {

    const menu = document.getElementById("menu");

    if (menu) {

        menu.scrollIntoView({

            behavior: "smooth"

        });

    }

}

// =====================================================
// Floating Cart
// =====================================================

const floatingCart = document.getElementById("floating-cart");

if (floatingCart) {

    floatingCart.addEventListener("click", () => {

        if (typeof openCart === "function") {

            openCart();

        }

    });

}

// =====================================================
// Checkout Button
// =====================================================

const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", () => {

        const modal = document.getElementById("checkout-modal");

        if (modal) {

            modal.classList.add("show");

        }

    });

}

// =====================================================
// Close Checkout
// =====================================================

const closeCheckout = document.getElementById("close-checkout");

if (closeCheckout) {

    closeCheckout.addEventListener("click", () => {

        document
            .getElementById("checkout-modal")
            .classList
            .remove("show");

    });

}

// =====================================================
// Checkout Form
// =====================================================

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (e) {

        e.preventDefault();

        if (typeof sendWhatsAppOrder === "function") {

            sendWhatsAppOrder();

        } else {

            alert("cart.js not loaded.");

        }

    });

}

// =====================================================
// Close Cart
// =====================================================

const closeCartButton = document.getElementById("close-cart");

if (closeCartButton) {

    closeCartButton.addEventListener("click", () => {

        if (typeof closeCart === "function") {

            closeCart();

        }

    });

}

// =====================================================
// Overlay
// =====================================================

const overlay = document.getElementById("overlay");

if (overlay) {

    overlay.addEventListener("click", () => {

        if (typeof closeCart === "function") {

            closeCart();

        }

        document
            .getElementById("checkout-modal")
            ?.classList
            .remove("show");

    });

}

// =====================================================
// Open first category after render
// =====================================================

function openFirstCategory() {

    const firstBody = document.querySelector(".category-products");

    const firstToggle = document.querySelector(".toggle-btn");

    if (!firstBody) return;

    firstBody.classList.add("open");

    if (firstToggle) {

        firstToggle.innerHTML = "−";

    }

}

// =====================================================
// Re-open first category after rendering
// =====================================================

const originalRenderProducts = renderProducts;

renderProducts = function (products) {

    originalRenderProducts(products);

    openFirstCategory();

};

// =====================================================
// Update Cart Count
// =====================================================

function updateCartBadge(count) {

    const badge1 = document.getElementById("cart-count");

    const badge2 = document.getElementById("floating-cart-count");

    if (badge1) badge1.textContent = count;

    if (badge2) badge2.textContent = count;

}

// =====================================================
// Welcome
// =====================================================

console.log(
    "🍦 Vamshi's Tasteuraa Loaded Successfully"
);


