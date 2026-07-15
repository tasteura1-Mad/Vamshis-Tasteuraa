// Your WhatsApp Number
const whatsappNumber = "917337200322";

// Cart Array

let cart = [];

  function addToCart(productId, size = "regular") {

    const product = products.find(p => p.id == productId);

    if (!product) return;

    // Decide the price based on size
    let selectedPrice;

    if (product.price) {
        selectedPrice = product.price;
    } else {
        selectedPrice = (size === "large") ? product.large : product.regular;
    }

    // Check if same product and same size already exists
    const existing = cart.find(item =>
        item.id == productId &&
        item.size == size
    );

    if (existing) {

        existing.qty++;

    } else {

        cart.push({

            ...product,

            qty: 1,

            size: size,

            price: selectedPrice

        });

    }

    updateCart();

}

function changeQty(id, change) {

    const item = cart.find(i => i.id == id);

    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {

        cart = cart.filter(i => i.id != id);

    }

    updateCart();

}

function updateCart() {

    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cart-count").innerText = count;

    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const price = item.price ? item.price : item.regular;

        total += price * item.qty;

        cartItems.innerHTML += `

        <div class="cart-item">

        <h3>${item.name}</h3>

    <p><b>${item.size.toUpperCase()}</b></p>

    <p>₹${price}</p>

            <div class="qty-controls">

                <button onclick="changeQty(${item.id},-1)">−</button>

                <span>${item.qty}</span>

                <button onclick="changeQty(${item.id},1)">+</button>

            </div>

        </div>

        `;

    });

    document.getElementById("cart-total").innerText = "₹" + total;

}

// Make functions available to HTML onclick handlers
window.addToCart = addToCart;
window.changeQty = changeQty;

document.getElementById("send-whatsapp").addEventListener("click", sendToWhatsApp);

function sendToWhatsApp() {

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const landmark = document.getElementById("customer-landmark").value.trim();
    const delivery = document.getElementById("delivery-type").value;
    const note = document.getElementById("special-note").value.trim();

    if(name === "" || phone === ""){

        alert("Please enter your Name and Mobile Number.");

        return;

    }

    if(cart.length === 0){

        alert("Your cart is empty.");

        return;

    }

    let message = `🍦 *Vamshi's Tasteuraa*%0A`;
    message += `Premium Homemade Ice Creams%0A%0A`;

    message += `*Customer Details*%0A`;
    message += `👤 Name : ${name}%0A`;
    message += `📞 Phone : ${phone}%0A`;
    message += `📍 Address : ${address}%0A`;
    message += `🏠 Landmark : ${landmark}%0A`;
    message += `🚚 Delivery : ${delivery}%0A`;

    if(note !== ""){
        message += `📝 Instructions : ${note}%0A`;
    }

    message += `%0A------------------------%0A`;

    message += `*Order Details*%0A`;

    let total = 0;

    cart.forEach(item=>{

        const price = item.price;

        total += price * item.qty;

        message += `• ${item.name}`;

        if(item.size){

            message += ` (${item.size})`;

        }

        message += ` x ${item.qty}`;

        message += ` - ₹${price * item.qty}%0A`;

    });

    message += `%0A------------------------%0A`;

    message += `💰 *Total : ₹${total}*%0A%0A`;

    message += `Please confirm item availability.%0A`;

    message += `Once confirmed, I will make the payment.%0A`;

    const url = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url,"_blank");

}