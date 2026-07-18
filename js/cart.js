// ======================================================
// Vamshi's Tasteuraa Cart
// Premium Version 2.0
// ======================================================

// ------------------------------------------------------
// Cart Data
// ------------------------------------------------------

let cart = [];

// ------------------------------------------------------
// Delivery Configuration
// ------------------------------------------------------

const FREE_DELIVERY_LIMIT = 299;

const DELIVERY_CHARGE = 49;

// ------------------------------------------------------
// Add Item
// ------------------------------------------------------

function addItem(name, size, price) {

    const existing = cart.find(item =>

        item.name === name &&
        item.size === size

    );

    if (existing) {

        existing.quantity++;

    }

    else {

        cart.push({

            name: name,

            size: size,

            price: Number(price),

            quantity: 1

        });

    }

    updateCart();

}

// ------------------------------------------------------
// Increase Quantity
// ------------------------------------------------------

function increaseItem(index) {

    if (!cart[index]) return;

    cart[index].quantity++;

    updateCart();

}

// ------------------------------------------------------
// Decrease Quantity
// ------------------------------------------------------

function decreaseItem(index) {

    if (!cart[index]) return;

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();

}

// ------------------------------------------------------
// Remove Item
// ------------------------------------------------------

function removeItem(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    updateCart();

}

// ------------------------------------------------------
// Get Subtotal
// ------------------------------------------------------

function getSubtotal() {

    return cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);

}

// ------------------------------------------------------
// Delivery Charge
// ------------------------------------------------------

function getDeliveryCharge() {

    const subtotal = getSubtotal();

    if (subtotal === 0) {

        return 0;

    }

    if (subtotal >= FREE_DELIVERY_LIMIT) {

        return 0;

    }

    return DELIVERY_CHARGE;

}

// ------------------------------------------------------
// Grand Total
// ------------------------------------------------------

function getGrandTotal() {

    return getSubtotal() + getDeliveryCharge();

}

// ------------------------------------------------------
// Total Items
// ------------------------------------------------------

function getItemCount() {

    return cart.reduce((count, item) => {

        return count + item.quantity;

    }, 0);

}
// ------------------------------------------------------
// Update Cart
// ------------------------------------------------------

function updateCart() {

    const cartItems = document.getElementById("cart-items");

    const subtotalElement = document.getElementById("cart-subtotal");

    const deliveryElement = document.getElementById("delivery-charge");

    const totalElement = document.getElementById("cart-total");

    const summaryItems = document.getElementById("summary-items");

    const summaryTotal = document.getElementById("summary-total");

    cartItems.innerHTML = "";

    // -----------------------------
    // Empty Cart
    // -----------------------------

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="text-align:center;padding:40px;color:#777;">

                🛒<br><br>

                Your cart is empty

            </div>

        `;

        subtotalElement.textContent = "₹0";

        if (deliveryElement)
            deliveryElement.textContent = "₹0";

        totalElement.textContent = "₹0";

        summaryItems.textContent = "0";

        summaryTotal.textContent = "₹0";

        if (typeof updateCartBadge === "function") {

            updateCartBadge(0);

        }

        return;

    }

    // -----------------------------
    // Cart Items
    // -----------------------------

    cart.forEach((item, index) => {

        cartItems.innerHTML += `

        <div class="cart-item">

            <div>

                <div class="cart-item-name">

                    ${item.name}

                </div>

                <div class="cart-item-size">

                    ${item.size}

                </div>

                <div style="margin-top:8px;font-weight:600;">

                    ₹${item.price}

                </div>

            </div>

            <div style="text-align:right;">

                <div style="display:flex;gap:8px;justify-content:flex-end;align-items:center;">

                    <button
                        onclick="decreaseItem(${index})"
                        style="width:28px;height:28px;border:none;border-radius:50%;background:#F59E0B;color:#fff;cursor:pointer;">

                        -

                    </button>

                    <strong>

                        ${item.quantity}

                    </strong>

                    <button
                        onclick="increaseItem(${index})"
                        style="width:28px;height:28px;border:none;border-radius:50%;background:#22c55e;color:#fff;cursor:pointer;">

                        +

                    </button>

                </div>

                <div style="margin-top:10px;">

                    <strong>

                        ₹${item.price * item.quantity}

                    </strong>

                </div>

                <button
                    onclick="removeItem(${index})"
                    style="margin-top:8px;border:none;background:none;color:#ef4444;cursor:pointer;">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    // -----------------------------
    // Totals
    // -----------------------------

    const subtotal = getSubtotal();

    const delivery = getDeliveryCharge();

    const grandTotal = getGrandTotal();

    subtotalElement.textContent = "₹" + subtotal;

    if (deliveryElement) {

        if (delivery === 0 && subtotal >= FREE_DELIVERY_LIMIT) {

            deliveryElement.innerHTML = `<span style="color:#16a34a;font-weight:700;">FREE</span>`;

        }

        else {

            deliveryElement.textContent = "₹" + delivery;

        }

    }

    totalElement.textContent = "₹" + grandTotal;

    summaryItems.textContent = getItemCount();

    summaryTotal.textContent = "₹" + grandTotal;

    // -----------------------------
    // Free Delivery Message
    // -----------------------------

    let deliveryInfo = document.getElementById("delivery-info");

    if (!deliveryInfo) {

        deliveryInfo = document.createElement("div");

        deliveryInfo.id = "delivery-info";

        deliveryInfo.style.marginTop = "15px";
        deliveryInfo.style.padding = "12px";
        deliveryInfo.style.borderRadius = "10px";
        deliveryInfo.style.fontWeight = "600";
        deliveryInfo.style.textAlign = "center";
        deliveryInfo.style.fontSize = "14px";

        document.querySelector(".cart-footer").appendChild(deliveryInfo);

    }

    if (subtotal >= FREE_DELIVERY_LIMIT) {

        deliveryInfo.style.background = "#DCFCE7";

        deliveryInfo.style.color = "#166534";

        deliveryInfo.innerHTML = "🎉 Congratulations! You have FREE Delivery.";

    }

    else {

        const remaining = FREE_DELIVERY_LIMIT - subtotal;

        deliveryInfo.style.background = "#FEF3C7";

        deliveryInfo.style.color = "#92400E";

        deliveryInfo.innerHTML = `🛍️ Add <strong>₹${remaining}</strong> more to get <strong>FREE Delivery!</strong>`;

    }

    // -----------------------------
    // Badge
    // -----------------------------

    if (typeof updateCartBadge === "function") {

        updateCartBadge(getItemCount());

    }

}
// ------------------------------------------------------
// Open Cart
// ------------------------------------------------------

function openCart() {

    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("overlay");

    if (panel) {

        panel.classList.add("open");

    }

    if (overlay) {

        overlay.classList.add("show");

    }

}

// ------------------------------------------------------
// Close Cart
// ------------------------------------------------------

function closeCart() {

    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("overlay");

    if (panel) {

        panel.classList.remove("open");

    }

    if (overlay) {

        overlay.classList.remove("show");

    }

}

// ------------------------------------------------------
// Toggle Cart
// ------------------------------------------------------

function toggleCart() {

    const panel = document.getElementById("cart-panel");

    if (!panel) return;

    if (panel.classList.contains("open")) {

        closeCart();

    } else {

        openCart();

    }

}

// ------------------------------------------------------
// Open Checkout
// ------------------------------------------------------

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    const modal = document.getElementById("checkout-modal");

    if (modal) {

        modal.classList.add("show");

    }

}

// ------------------------------------------------------
// Close Checkout
// ------------------------------------------------------

function closeCheckout() {

    const modal = document.getElementById("checkout-modal");

    if (modal) {

        modal.classList.remove("show");

    }

}

// ------------------------------------------------------
// Cart Button Events
// ------------------------------------------------------

const cartButton = document.getElementById("cartButton");

if (cartButton) {

    cartButton.addEventListener("click", openCart);

}

const floatingCart = document.getElementById("floating-cart");

if (floatingCart) {

    floatingCart.addEventListener("click", openCart);

}

const overlay = document.getElementById("overlay");

if (overlay) {

    overlay.addEventListener("click", closeCart);

}

// ------------------------------------------------------
// ESC Key Support
// ------------------------------------------------------

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeCart();

        closeCheckout();

    }

});

// ------------------------------------------------------
// Delivery Type Change
// ------------------------------------------------------

const deliveryType = document.getElementById("delivery-type");

if (deliveryType) {

    deliveryType.addEventListener("change", function () {

        const addressGroup = document.getElementById("address-group");
        const landmarkGroup = document.getElementById("landmark-group");

        if (!addressGroup || !landmarkGroup) return;

        if (this.value === "Delivery") {

            addressGroup.style.display = "block";
            landmarkGroup.style.display = "block";

        }

        else {

            addressGroup.style.display = "none";
            landmarkGroup.style.display = "none";

        }

    });

}
// ------------------------------------------------------
// WhatsApp Order
// ------------------------------------------------------

function sendWhatsAppOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    const name = document.getElementById("customer-name").value.trim();

    const phone = document.getElementById("customer-phone").value.trim();

    const deliveryType = document.getElementById("delivery-type").value;

    const address = document.getElementById("customer-address").value.trim();

    const landmark = document.getElementById("customer-landmark").value.trim();

    const note = document.getElementById("special-note").value.trim();

    if (name === "") {

        alert("Please enter your name.");

        return;

    }

    if (!/^[6-9]\d{9}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;

    }

    if (deliveryType === "Delivery" && address === "") {

        alert("Please enter your delivery address.");

        return;

    }

    const subtotal = getSubtotal();

    const deliveryCharge = getDeliveryCharge();

    const grandTotal = getGrandTotal();

    let message = "";

    message += "🍦 *Vamshi's Tasteuraa*%0A";
    message += "━━━━━━━━━━━━━━━━━━%0A%0A";

    message += "👤 *Customer:* " + name + "%0A";
    message += "📞 *Mobile:* " + phone + "%0A";
    message += "🚚 *Order Type:* " + deliveryType + "%0A";

    if (deliveryType === "Delivery") {

        message += "📍 *Address:* " + address + "%0A";

        if (landmark !== "") {

            message += "🏠 *Landmark:* " + landmark + "%0A";

        }

    }

    if (note !== "") {

        message += "📝 *Instructions:* " + note + "%0A";

    }

    message += "%0A";
    message += "━━━━━━━━━━━━━━━━━━%0A";
    message += "🛍️ *ORDER ITEMS*%0A";
    message += "━━━━━━━━━━━━━━━━━━%0A";

    cart.forEach(item => {

        message +=
            "• " +
            item.name +
            " (" +
            item.size +
            ") x " +
            item.quantity +
            " = ₹" +
            (item.price * item.quantity) +
            "%0A";

    });

    message += "%0A";
    message += "━━━━━━━━━━━━━━━━━━%0A";

    message += "Subtotal : ₹" + subtotal + "%0A";

    if (deliveryCharge === 0) {

        message += "Delivery : FREE 🎉%0A";

    } else {

        message += "Delivery : ₹" + deliveryCharge + "%0A";

    }

    message += "━━━━━━━━━━━━━━━━━━%0A";

    message += "💰 *Grand Total : ₹" + grandTotal + "*%0A";

    message += "━━━━━━━━━━━━━━━━━━";

    const whatsappNumber = "917337200322";

    window.open(

        "https://wa.me/" +

        whatsappNumber +

        "?text=" +

        encodeURIComponent(decodeURIComponent(message)),

        "_blank"

    );

    // Clear Cart

    cart = [];

    updateCart();

    closeCheckout();

    closeCart();

    const form = document.getElementById("checkout-form");

    if (form) {

        form.reset();

    }

}

// ------------------------------------------------------
// Initialize Cart
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    updateCart();

    const deliveryType = document.getElementById("delivery-type");

    if (deliveryType) {

        deliveryType.dispatchEvent(new Event("change"));

    }

});

// ------------------------------------------------------
// Console
// ------------------------------------------------------

console.log("🍦 Vamshi's Tasteuraa Premium Cart Loaded Successfully");




