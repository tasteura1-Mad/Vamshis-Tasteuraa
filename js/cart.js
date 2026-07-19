// =====================================================
// Vamshi's Tasteuraa
// cart.js
// =====================================================

const whatsappNumber = "917337200322";

let cart = [];

// ==========================
// Persistence
// ==========================

function loadCart() {

    try {

        const saved = localStorage.getItem("tasteuraa_cart");
        cart = saved ? JSON.parse(saved) : [];

    } catch {

        cart = [];

    }

    renderCart();

}

function saveCart() {

    localStorage.setItem("tasteuraa_cart", JSON.stringify(cart));

}

// ==========================
// Cart Operations
// ==========================

function addItem(name, size, price) {

    const existing = cart.find(i => i.name === name && i.size === size);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({ name, size, price, qty: 1 });

    }

    saveCart();
    renderCart();

}

function changeCartQty(index, change) {

    const item = cart[index];

    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {

        cart.splice(index, 1);

    }

    saveCart();
    renderCart();

}

function removeCartItem(index) {

    cart.splice(index, 1);

    saveCart();
    renderCart();

}

// ==========================
// Render
// ==========================

function renderCart() {

    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    if (typeof updateCartBadge === "function") {
        updateCartBadge(count);
    }

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `<p class="empty-cart">🛒 Your cart is empty.<br>Add something delicious!</p>`;

        if (totalEl) totalEl.textContent = "₹0";

        return;

    }

    let total = 0;

    container.innerHTML = cart.map((item, index) => {

        const lineTotal = item.price * item.qty;
        total += lineTotal;

        return `
        <div class="cart-item">
            <h3>${item.name}</h3>
            <p><b>${item.size}</b> · ₹${item.price} each</p>
            <div class="qty-controls">
                <button onclick="changeCartQty(${index},-1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeCartQty(${index},1)">+</button>
                <button class="remove-btn" onclick="removeCartItem(${index})" aria-label="Remove item">🗑</button>
            </div>
            <p class="line-total">₹${lineTotal}</p>
        </div>
        `;

    }).join("");

    if (totalEl) totalEl.textContent = "₹" + total;

}

// ==========================
// Open / Close Cart Panel
// ==========================

function openCart() {

    document.getElementById("cart-panel")?.classList.add("open");
    document.getElementById("overlay")?.classList.add("show");

}

function closeCart() {

    document.getElementById("cart-panel")?.classList.remove("open");
    document.getElementById("overlay")?.classList.remove("show");

}

// ==========================
// WhatsApp Order
// ==========================

function sendWhatsAppOrder() {

    const name = document.getElementById("customer-name")?.value.trim() || "";
    const phoneRaw = document.getElementById("customer-phone")?.value.trim() || "";
    const address = document.getElementById("customer-address")?.value.trim() || "";
    const landmark = document.getElementById("customer-landmark")?.value.trim() || "";
    const delivery = document.getElementById("delivery-type")?.value || "Pickup";
    const note = document.getElementById("special-note")?.value.trim() || "";

    if (name === "") {

        alert("Please enter your name.");
        return;

    }

    const phoneDigits = phoneRaw.replace(/\D/g, "");

    if (phoneDigits.length < 10) {

        alert("Please enter a valid 10-digit mobile number.");
        return;

    }

    if (delivery === "Home Delivery" && address === "") {

        alert("Please enter your delivery address for Home Delivery.");
        return;

    }

    if (cart.length === 0) {

        alert("Your cart is empty.");
        return;

    }

    let message = `🍦 *Vamshi's Tasteuraa*\n`;
    message += `Premium Homemade Ice Creams\n\n`;

    message += `*Customer Details*\n`;
    message += `👤 Name: ${name}\n`;
    message += `📞 Phone: ${phoneRaw}\n`;

    if (address !== "") {
        message += `📍 Address: ${address}\n`;
    }

    if (landmark !== "") {
        message += `🏠 Landmark: ${landmark}\n`;
    }

    message += `🚚 Delivery: ${delivery}\n`;

    if (note !== "") {
        message += `📝 Instructions: ${note}\n`;
    }

    message += `\n------------------------\n`;
    message += `*Order Details*\n`;

    let total = 0;

    cart.forEach(item => {

        const lineTotal = item.price * item.qty;
        total += lineTotal;

        message += `• ${item.name} (${item.size}) x ${item.qty} - ₹${lineTotal}\n`;

    });

    message += `\n------------------------\n`;
    message += `💰 *Total: ₹${total}*\n\n`;
    message += `Please confirm item availability.\n`;
    message += `Once confirmed, I will make the payment.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    // Clear cart + form after the order is sent
    cart = [];
    saveCart();
    renderCart();

    document.getElementById("checkout-form")?.reset();

    if (typeof closeCheckout === "function") closeCheckout();
    closeCart();

}

// ==========================
// Init
// ==========================

document.addEventListener("DOMContentLoaded", loadCart);

// Expose for inline onclick handlers / app.js
window.addItem = addItem;
window.changeCartQty = changeCartQty;
window.removeCartItem = removeCartItem;
window.openCart = openCart;
window.closeCart = closeCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.updateCartBadge = updateCartBadge;
