// ======================================================
// Vamshi's Tasteuraa Cart
// ======================================================

let cart = [];

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

    } else {

        cart.push({
            name,
            size,
            price,
            quantity: 1
        });

    }

    updateCart();

}

// ------------------------------------------------------
// Increase Quantity
// ------------------------------------------------------

function increaseItem(index) {

    cart[index].quantity++;

    updateCart();

}

// ------------------------------------------------------
// Decrease Quantity
// ------------------------------------------------------

function decreaseItem(index) {

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

    cart.splice(index, 1);

    updateCart();

}

// ------------------------------------------------------
// Cart Total
// ------------------------------------------------------

function getTotal() {

    return cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);

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

    const total = document.getElementById("cart-total");

    const subtotal = document.getElementById("cart-subtotal");

    const summaryTotal = document.getElementById("summary-total");

    const summaryItems = document.getElementById("summary-items");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `

        <div style="text-align:center;padding:40px;color:#777;">

            🛒<br><br>

            Your cart is empty

        </div>

        `;

    }

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

    const totalAmount = getTotal();

    subtotal.textContent = "₹" + totalAmount;

    total.textContent = "₹" + totalAmount;

    summaryTotal.textContent = "₹" + totalAmount;

    summaryItems.textContent = getItemCount();

    if (typeof updateCartBadge === "function") {

        updateCartBadge(getItemCount());

    }

}

// ------------------------------------------------------
// Open Cart
// ------------------------------------------------------

function openCart() {

    document
        .getElementById("cart-panel")
        .classList
        .add("open");

    document
        .getElementById("overlay")
        .classList
        .add("show");

}

// ------------------------------------------------------
// Close Cart
// ------------------------------------------------------

function closeCart() {

    document
        .getElementById("cart-panel")
        .classList
        .remove("open");

    document
        .getElementById("overlay")
        .classList
        .remove("show");

}

// ------------------------------------------------------
// Cart Buttons
// ------------------------------------------------------

const cartButton = document.getElementById("cartButton");

if (cartButton) {

    cartButton.addEventListener("click", openCart);

}

const floatingCart = document.getElementById("floating-cart");

if (floatingCart) {

    floatingCart.addEventListener("click", openCart);

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

    if (phone.length < 10) {

        alert("Please enter a valid mobile number.");

        return;

    }

    let message = "*🍦 Vamshi's Tasteuraa Order*%0A%0A";

    message += "*Customer:* " + name + "%0A";
    message += "*Mobile:* " + phone + "%0A";
    message += "*Order Type:* " + deliveryType + "%0A";

    if (deliveryType === "Delivery") {

        message += "*Address:* " + address + "%0A";

        if (landmark !== "") {

            message += "*Landmark:* " + landmark + "%0A";

        }

    }

    if (note !== "") {

        message += "*Instructions:* " + note + "%0A";

    }

    message += "%0A*Items Ordered*%0A";

    cart.forEach(item => {

        message += "• " +
            item.name +
            " (" +
            item.size +
            ") x " +
            item.quantity +
            " = ₹" +
            (item.price * item.quantity) +
            "%0A";

    });

    message += "%0A*Total:* ₹" + getTotal();

    const whatsappNumber = "917337200322";

    window.open(
        "https://wa.me/" + whatsappNumber + "?text=" + message,
        "_blank"
    );

    cart = [];

    updateCart();

    closeCart();

    document
        .getElementById("checkout-modal")
        .classList
        .remove("show");

    document
        .getElementById("checkout-form")
        .reset();

}

// ------------------------------------------------------
// Initialize Cart
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    updateCart();

});

console.log("🛒 Cart Loaded Successfully");



        
