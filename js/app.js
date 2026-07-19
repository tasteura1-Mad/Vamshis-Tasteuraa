// =====================================================
// Vamshi's Tasteuraa
// app.js
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentCategory = "All";

// Keys MUST match the "category" values in products.json exactly
const categoryIcons = {
    "French Fries": "🍟",
    "Momos (Fried)": "🥟",
    "Veg Bites": "🥗",
    "Non-Veg Bites": "🍗",
    "Burger": "🍔",
    "Maggi": "🍜",
    "Special": "🔥",
    "Beverages": "☕",
    "Boba Coolers": "🧋",
    "Boba Shakes": "🧋",
    "Classic Mojito": "🍹",
    "Ice Cream Box": "🍨",
    "Ice Cream Scoops": "🍦",
    "Milk Shakes": "🥤",
    "Thick Shakes": "🥛",
    "Toppings": "✨"
};

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadProducts();

    bindSearch();

    bindSort();

    bindCartButtons();

}

async function loadProducts() {

    const container = document.getElementById("category-products");
    if (container) container.innerHTML = `<p class="status-msg">Loading menu... 🍦</p>`;

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

        if (container) {
            container.innerHTML = `<p class="status-msg error">⚠️ Sorry, we couldn't load the menu. Please refresh the page or try again shortly.</p>`;
        }

    }

}

function bindSearch() {

    const search = document.getElementById("search");

    if (!search) return;

    search.addEventListener("input", applyFilters);

}

function bindSort() {

    const sort = document.getElementById("sort");

    if (!sort) return;

    sort.addEventListener("change", applyFilters);

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

// Single source of truth for filtering + sorting (search input, sort dropdown,
// and category buttons all funnel through here)
function applyFilters() {

    const keyword =

        document.getElementById("search")

        ?.value

        .trim()

        .toLowerCase() || "";

    const sortValue = document.getElementById("sort")?.value || "default";

    filteredProducts = allProducts.filter(product => {

        const categoryMatch =
            currentCategory === "All" ||
            product.category === currentCategory;

        const searchMatch =
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword);

        return categoryMatch && searchMatch;

    });

    const priceOf = (product) => {
        if (product.sizes && product.sizes.length) return product.sizes[0].price;
        return product.price ?? product.regular ?? 0;
    };

    if (sortValue === "low") {

        filteredProducts.sort((a, b) => priceOf(a) - priceOf(b));

    } else if (sortValue === "high") {

        filteredProducts.sort((a, b) => priceOf(b) - priceOf(a));

    } else if (sortValue === "name") {

        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

    }

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
                <p>Please try another search or category.</p>
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
            class="category-products-body"
            id="${bodyId}">

        </div>

        `;

        container.appendChild(card);

        const body = card.querySelector(".category-products-body");
        const toggle = card.querySelector(".toggle-btn");
        const header = card.querySelector(".category-header");

        header.addEventListener("click", () => {

            document.querySelectorAll(".category-products-body")
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

    // Open first category by default
    const firstBody = document.querySelector(".category-products-body");
    const firstToggle = document.querySelector(".toggle-btn");

    if (firstBody) firstBody.classList.add("open");
    if (firstToggle) firstToggle.textContent = "−";

}

// =====================================================
// Product Card
// =====================================================

function createProductCard(product) {

    const card = document.createElement("div");
    card.className = "product-card";

    const icon = categoryIcons[product.category] || "🍽️";

    // Support sizes[], regular/large, or a single price field
    const sizes = product.sizes && product.sizes.length
        ? product.sizes
        : (product.regular != null)
            ? [
                { size: "Regular", price: product.regular },
                ...(product.large != null ? [{ size: "Large", price: product.large }] : [])
              ]
            : [{ size: "Regular", price: product.price ?? 0 }];

    const defaultSize = sizes[0];
    const isBestseller = product.isBestseller || product.id <= 10;

    card.innerHTML = `

        <div class="product-top">

            <div class="product-icon">${icon}</div>

            ${isBestseller
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

        ${sizes.length > 1 ? `
        <div class="product-size">

            <label>Size</label>

            <select class="size-select">

                ${sizes.map(s => `
                    <option
                        value="${s.size}"
                        data-price="${s.price}">
                        ${s.size} — ₹${s.price}
                    </option>
                `).join("")}

            </select>

        </div>
        ` : ''}

        <div class="product-price">
            ₹<span class="price">${defaultSize.price}</span>
        </div>

        <div class="qty-box">
            <button class="minus" aria-label="Decrease quantity">−</button>
            <span class="qty">1</span>
            <button class="plus" aria-label="Increase quantity">+</button>
        </div>

        <button class="add-btn">
            🛒 Add To Cart
        </button>

    `;

    const sizeSelect = card.querySelector(".size-select");
    const price = card.querySelector(".price");

    if (sizeSelect) {

        sizeSelect.addEventListener("change", function () {

            const option = this.options[this.selectedIndex];
            price.textContent = option.dataset.price;

        });

    }

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

    const addBtn = card.querySelector(".add-btn");

    addBtn.onclick = () => {

        const selectedSize = sizeSelect
            ? sizeSelect.options[sizeSelect.selectedIndex]
            : { value: defaultSize.size, dataset: { price: defaultSize.price } };

        for (let i = 0; i < qty; i++) {

            addItem(
                product.name,
                selectedSize.value,
                Number(selectedSize.dataset.price)
            );

        }

        // reset qty and give quick visual feedback
        qty = 1;
        qtySpan.textContent = qty;

        const originalText = addBtn.textContent;
        addBtn.textContent = "✅ Added";
        addBtn.disabled = true;

        setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.disabled = false;
        }, 700);

    };

    return card;

}

// =====================================================
// CART & CHECKOUT BUTTON BINDINGS
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

    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
            if (typeof closeCart === "function") closeCart();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {

            if (typeof closeCart === "function") closeCart();

            closeCheckout();

        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (typeof closeCart === "function") closeCart();
            openCheckout();
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener("click", closeCheckout);
    }

    if (checkoutModal) {

        checkoutModal.addEventListener("click", function (e) {

            if (e.target === checkoutModal) {

                closeCheckout();

            }

        });

    }

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

    if (badge1) badge1.textContent = count;
    if (badge2) badge2.textContent = count;

}

// =====================================================
// HELPERS
// =====================================================

function getProductByName(name) {

    return allProducts.find(item => item.name === name);

}
