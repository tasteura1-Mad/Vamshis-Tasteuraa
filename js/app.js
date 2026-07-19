// =====================================================
// Vamshi's Tasteuraa
// Corrected app.js
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentCategory = "All";

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

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadProducts();

    bindSearch();

    bindCartButtons();

}

async function loadProducts() {

    try {

        const response = await fetch("data/products.json");

        if (!response.ok) {

            throw new Error("products.json not found");

        }

        allProducts = await response.json();

        filteredProducts = [...allProducts];

        createCategoryButtons();

        renderProducts(filteredProducts);

    }
    catch (err) {

        console.error(err);

    }

}

function bindSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    search.addEventListener("input", () => {

        const keyword = search.value.trim().toLowerCase();

        filteredProducts = allProducts.filter(product => {

            const categoryMatch =
                currentCategory === "All" ||
                product.category === currentCategory;

            const searchMatch =
                product.name.toLowerCase().includes(keyword);

            return categoryMatch && searchMatch;

        });

        renderProducts(filteredProducts);

    });

}

function createCategoryButtons() {

    const container = document.getElementById("categories");

    if (!container) return;

    container.innerHTML = "";

    const categories = [...new Set(allProducts.map(p => p.category))];

    const allBtn = createButton("🍽️ All", "All");

    allBtn.classList.add("active");

    container.appendChild(allBtn);

    categories.forEach(cat => {

        container.appendChild(

            createButton(

                `${categoryIcons[cat] || "🍴"} ${cat}`,

                cat

            )

        );

    });

}

function createButton(text, category) {

    const btn = document.createElement("button");

    btn.className = "category-btn";

    btn.textContent = text;

    btn.onclick = () => {

        document

            .querySelectorAll(".category-btn")

            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentCategory = category;

        applyFilters();

    };

    return btn;

}

function applyFilters() {

    const keyword =

        document.getElementById("search")

        ?.value

        .trim()

        .toLowerCase() || "";

    filteredProducts = allProducts.filter(product => {

        const categoryMatch =
            currentCategory === "All" ||
            product.category === currentCategory;

        const searchMatch =
            product.name.toLowerCase().includes(keyword);

        return categoryMatch && searchMatch;

    });

    renderProducts(filteredProducts);

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
            <div class="no-products">
                <h2>😔 No Products Found</h2>
                <p>Please try another search.</p>
            </div>
        `;

        return;

    }

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

        const bodyId = "category_" + index;

        card.innerHTML = `

        <div class="category-header">

            <h3>

                ${categoryIcons[category] || "🍴"}

                ${category}

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

        const body = card.querySelector(".category-products");

        const toggle = card.querySelector(".toggle-btn");

        const header = card.querySelector(".category-header");

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

                        btn.textContent = "+";

                    }

                });

            body.classList.toggle("open");

            toggle.textContent =

                body.classList.contains("open")

                ? "−"

                : "+";

        });

        grouped[category].forEach(product => {

            body.appendChild(

                createProductCard(product)

            );

        });

    });

    // Open first category

    const firstCategory =

        document.querySelector(".category-products");

    const firstToggle =

        document.querySelector(".toggle-btn");

    if (firstCategory) {

        firstCategory.classList.add("open");

    }

    if (firstToggle) {

        firstToggle.textContent = "−";

    }

}

// =====================================================
// Product Card
// =====================================================

function createProductCard(product) {

    const card = document.createElement("div");
    card.className = "product-card";

    const icon = categoryIcons[product.category] || "🍽️";

    // Support both new and old JSON formats
    const sizes = product.sizes && product.sizes.length
        ? product.sizes
        : [{
            size: "Regular",
            price: product.price || product.single || 0
        }];

    const defaultSize = sizes[0];

    card.innerHTML = `

        <div class="product-top">

            <div class="product-icon">${icon}</div>

            ${product.isBestseller
                ? '<span class="badge bestseller">⭐ Bestseller</span>'
                : ''}

        </div>

        <div class="product-name">
            ${product.name}
        </div>

        <div class="product-description">
            ${product.description || ""}
        </div>

        <div class="product-type">
            ${product.type === "nonveg"
                ? '<span class="nonveg">🔴 Non-Veg</span>'
                : '<span class="veg">🟢 Veg</span>'}
        </div>

        <div class="product-size">

            <label>Size</label>

            <select class="size-select">

                ${sizes.map(s => `
                    <option
                        value="${s.size}"
                        data-price="${s.price}">
                        ${s.size}
                    </option>
                `).join("")}

            </select>

        </div>

        <div class="product-price">
            ₹<span class="price">${defaultSize.price}</span>
        </div>

        <div class="qty-box">
            <button class="minus">−</button>
            <span class="qty">1</span>
            <button class="plus">+</button>
        </div>

        <button class="add-btn">
            🛒 Add To Cart
        </button>

    `;

    const sizeSelect = card.querySelector(".size-select");
    const price = card.querySelector(".price");

    sizeSelect.addEventListener("change", function () {

        const option = this.options[this.selectedIndex];
        price.textContent = option.dataset.price;

    });

    let qty = 1;

    const qtySpan = card.querySelector(".qty");

    card.querySelector(".minus").onclick = () => {

        if (qty > 1) {
            qty--;
            qtySpan.textContent = qty;
        }

    };

    card.querySelector(".plus").onclick = () => {

        qty++;
        qtySpan.textContent = qty;

    };

    card.querySelector(".add-btn").onclick = () => {

        const option = sizeSelect.options[sizeSelect.selectedIndex];

        for (let i = 0; i < qty; i++) {

            addItem(
                product.name,
                option.value,
                Number(option.dataset.price)
            );

        }

    };

    return card;

}

// =====================================================
// CART & CHECKOUT
// =====================================================

function bindCartButtons() {

    const cartButton = document.getElementById("cartButton");
    const floatingCart = document.getElementById("floating-cart");
    const closeCartBtn = document.getElementById("close-cart");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeCheckoutBtn = document.getElementById("close-checkout");
    const checkoutModal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("overlay");
    const checkoutForm = document.getElementById("checkout-form");

    // Open Cart
    if (cartButton) {
        cartButton.addEventListener("click", () => {
            if (typeof openCart === "function") openCart();
        });
    }

    if (floatingCart) {
        floatingCart.addEventListener("click", () => {
            if (typeof openCart === "function") openCart();
        });
    }

    // Close Cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
            if (typeof closeCart === "function") closeCart();
        });
    }

    // Click outside cart
    if (overlay) {
        overlay.addEventListener("click", () => {

            if (typeof closeCart === "function") closeCart();

            closeCheckout();

        });
    }

    // Open Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", openCheckout);
    }

    // Close Checkout (X button)
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener("click", closeCheckout);
    }

    // Click outside checkout popup
    if (checkoutModal) {

        checkoutModal.addEventListener("click", function (e) {

            if (e.target === checkoutModal) {

                closeCheckout();

            }

        });

    }

    // Place Order
    if (checkoutForm) {

        checkoutForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (typeof sendWhatsAppOrder === "function") {

                sendWhatsAppOrder();

            }

        });

    }

}

// =====================================================
// CHECKOUT FUNCTIONS
// =====================================================

function openCheckout() {

    const modal = document.getElementById("checkout-modal");

    if (!modal) return;

    modal.classList.add("show");

    document.body.style.overflow = "hidden";

}

function closeCheckout() {

    const modal = document.getElementById("checkout-modal");

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow = "auto";

}

// =====================================================
// CART BADGE
// =====================================================

function updateCartBadge(count) {

    const badge1 = document.getElementById("cart-count");
    const badge2 = document.getElementById("floating-cart-count");

    if (badge1) {

        badge1.textContent = count;

    }

    if (badge2) {

        badge2.textContent = count;

    }

}

// =====================================================
// HELPERS
// =====================================================

function getProductByName(name) {

    return allProducts.find(item => item.name === name);

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
// DEBUG
// =====================================================

window.addEventListener("load", () => {

    console.log("🍦 App Loaded");

    console.log("Products :", allProducts.length);

    console.log("addItem :", typeof addItem);

    console.log("openCart :", typeof openCart);

});

// =====================================================
// END
// =====================================================


