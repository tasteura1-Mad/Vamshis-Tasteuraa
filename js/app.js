/* ==========================================
   Vamshi's Tasteuraa V2.0
   app.js - Part 1
========================================== */

let products = [];
let filteredProducts = [];
let selectedCategory = "All";

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadProducts();

    createCategoryButtons();

    displayProducts(filteredProducts);

    initializeSearch();

});

/* ==========================================
   LOAD PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const response = await fetch("data/products.json");

        products = await response.json();

        filteredProducts = [...products];

    }

    catch (error) {

        console.error("Unable to load products", error);

    }

}

/* ==========================================
   CATEGORY BUTTONS
========================================== */

function createCategoryButtons() {

    const container = document.getElementById("categories");

    if (!container) return;

    container.innerHTML = "";

    const categories = [
        "All",
        ...new Set(products.map(product => product.category))
    ];

    categories.forEach(category => {

        const button = document.createElement("button");

        button.className = "category-btn";

        if (category === "All")
            button.classList.add("active");

        button.innerHTML =
            `${getCategoryIcon(category)} ${category}`;

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedCategory = category;

            filterProducts();

        });

        container.appendChild(button);

    });

}

/* ==========================================
   FILTER PRODUCTS
========================================== */

function filterProducts() {

    if (selectedCategory === "All") {

        filteredProducts = [...products];

    }

    else {

        filteredProducts = products.filter(product =>
            product.category === selectedCategory
        );

    }

    displayProducts(filteredProducts);

}

/* ==========================================
   SEARCH
========================================== */

function initializeSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    search.addEventListener("input", () => {

        const keyword = search.value
            .trim()
            .toLowerCase();

        filteredProducts = products.filter(product => {

            const matchCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            const matchText =
                product.name.toLowerCase().includes(keyword);

            return matchCategory && matchText;

        });

        displayProducts(filteredProducts);

    });

}

/* ==========================================
   CATEGORY ICONS
========================================== */

function getCategoryIcon(category) {

    const icons = {

        "Ice Creams":"🍦",
        "Ice Cream Boxes":"🍨",
        "Milk Shakes":"🥤",
        "Thick Shakes":"🥛",
        "Boba Coolers":"🧋",
        "Boba Shakes":"🧋",
        "Mojitos":"🍹",
        "French Fries":"🍟",
        "Burgers":"🍔",
        "Veg Bites":"🥟",
        "Non Veg Bites":"🍗",
        "Momos":"🥠",
        "Specials":"⭐",
        "Maggi":"🍜",
        "Toppings":"🍫"

    };

    return icons[category] || "🍽️";

}

/* ==========================================
   PART 2 STARTS BELOW
========================================== */

/* ==========================================
   DISPLAY PRODUCTS (Accordion Style)
========================================== */

function displayProducts(productList) {

    const container = document.getElementById("category-products");

    if (!container) return;

    container.innerHTML = "";

    if (productList.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h2>😔 No Products Found</h2>
            </div>
        `;
        return;
    }

    // Group products by category
    const grouped = {};

    productList.forEach(product => {

        if (!grouped[product.category]) {
            grouped[product.category] = [];
        }

        grouped[product.category].push(product);

    });

    Object.keys(grouped).forEach(category => {

        const card = document.createElement("div");
        card.className = "category-card";

        card.innerHTML = `
            <div class="category-header">

                <div class="category-title">
                    ${getCategoryIcon(category)}
                    ${category}
                </div>

                <div class="toggle-btn">+</div>

            </div>

            <div class="category-products"></div>
        `;

        const productsContainer =
            card.querySelector(".category-products");

        grouped[category].forEach(product => {

            productsContainer.appendChild(
                createProductCard(product)
            );

        });

        // Accordion Toggle
        const header =
            card.querySelector(".category-header");

        header.addEventListener("click", () => {

            card.classList.toggle("open");

            const btn =
                card.querySelector(".toggle-btn");

            btn.textContent =
                card.classList.contains("open")
                ? "−"
                : "+";

        });

        container.appendChild(card);

    });

}

/* ==========================================
   CREATE PRODUCT CARD
========================================== */

function createProductCard(product) {

    const card = document.createElement("div");

    card.className = "product-card";

    // Image (optional)
    const image = product.image
        ? product.image
        : "images/products/default.png";

    // Price Section
    let priceHTML = "";

    if (product.regular && product.large) {

        priceHTML = `

            <div class="price-row">

                <span class="price-label">
                    Regular
                </span>

                <span class="price">
                    ₹${product.regular}
                </span>

                <button class="add-btn"
                    onclick="addProduct('${product.id}','Regular')">

                    Add

                </button>

            </div>

            <div class="price-row">

                <span class="price-label">
                    Large
                </span>

                <span class="price">
                    ₹${product.large}
                </span>

                <button class="add-btn"
                    onclick="addProduct('${product.id}','Large')">

                    Add

                </button>

            </div>

        `;

    } else {

        const price =
            product.price ||
            product.single ||
            product.regular;

        priceHTML = `

            <div class="single-price">

                <span class="price">

                    ₹${price}

                </span>

                <button class="add-btn"
                    onclick="addProduct('${product.id}')">

                    Add

                </button>

            </div>

        `;

    }

    card.innerHTML = `

        <div class="product-image">

            <img src="${image}"
                 alt="${product.name}">

        </div>

        <div class="product-body">

            <h3 class="product-title">

                ${product.name}

            </h3>

            <p class="product-desc">

                Homemade • Fresh • Premium Quality

            </p>

            <div class="product-rating">

                ⭐⭐⭐⭐⭐

            </div>

            ${priceHTML}

        </div>

    `;

    return card;

}

/* ==========================================
   ADD PRODUCT TO CART
========================================== */

function addProduct(productId, size = "") {

    const product =
        products.find(p => p.id == productId);

    if (!product) return;

    if (typeof addToCart === "function") {

        addToCart(product, size);

    } else {

        console.warn("addToCart() not found in cart.js");

    }

}
/* ==========================================
   SORT PRODUCTS
========================================== */

function initializeSorting() {

    const sortSelect = document.getElementById("sort");

    if (!sortSelect) return;

    sortSelect.addEventListener("change", () => {

        const value = sortSelect.value;

        switch (value) {

            case "name":

                filteredProducts.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );

                break;

            case "price-low":

                filteredProducts.sort((a, b) =>
                    getProductPrice(a) - getProductPrice(b)
                );

                break;

            case "price-high":

                filteredProducts.sort((a, b) =>
                    getProductPrice(b) - getProductPrice(a)
                );

                break;

            default:
                break;

        }

        displayProducts(filteredProducts);

    });

}

/* ==========================================
   GET LOWEST PRODUCT PRICE
========================================== */

function getProductPrice(product) {

    const prices = [];

    if (product.price)
        prices.push(Number(product.price));

    if (product.single)
        prices.push(Number(product.single));

    if (product.regular)
        prices.push(Number(product.regular));

    if (product.large)
        prices.push(Number(product.large));

    return prices.length ? Math.min(...prices) : 0;

}

/* ==========================================
   PRODUCT BADGES
========================================== */

function getProductBadge(product) {

    if (product.bestseller)
        return "🔥 Bestseller";

    if (product.new)
        return "🆕 New";

    if (product.homemade)
        return "❤️ Homemade";

    return "";

}

/* ==========================================
   ANIMATE PRODUCT CARDS
========================================== */

function animateCards() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = ".35s";

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        }, index * 40);

    });

}

/* ==========================================
   OPEN FIRST CATEGORY
========================================== */

function openFirstCategory() {

    const firstCard =
        document.querySelector(".category-card");

    if (!firstCard) return;

    firstCard.classList.add("open");

    const button =
        firstCard.querySelector(".toggle-btn");

    if (button)
        button.textContent = "−";

}

/* ==========================================
   COLLAPSE OTHER CATEGORIES
========================================== */

function enableSingleAccordion() {

    document.querySelectorAll(".category-header")
        .forEach(header => {

            header.addEventListener("click", () => {

                const current =
                    header.parentElement;

                document
                    .querySelectorAll(".category-card")
                    .forEach(card => {

                        if (card !== current) {

                            card.classList.remove("open");

                            const btn =
                                card.querySelector(".toggle-btn");

                            if (btn)
                                btn.textContent = "+";

                        }

                    });

            });

        });

}

/* ==========================================
   REFRESH UI
========================================== */

function refreshUI() {

    displayProducts(filteredProducts);

    animateCards();

    openFirstCategory();

    enableSingleAccordion();

}

/* ==========================================
   OVERRIDE DISPLAY FUNCTION
========================================== */

const originalDisplayProducts = displayProducts;

displayProducts = function (list) {

    originalDisplayProducts(list);

    animateCards();

    openFirstCategory();

    enableSingleAccordion();

};

/* ==========================================
   INITIALIZE SORTING
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSorting();

});

/* ==========================================
   END OF app.js
========================================== */




