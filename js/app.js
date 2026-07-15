let products = [];
let currentCategory = "All";

fetch("data/products.json")
    .then(res => res.json())
    .then(data => {

        products = data;

        console.log(products.length);
        console.log(products);
        console.log([...new Set(products.map(p => p.category))]);

        createCategories();
        displayProducts(products);

        document
            .getElementById("search")
            .addEventListener("input", filterProducts);

        document
            .getElementById("sort")
            .addEventListener("change", filterProducts);

    });


// ==========================
// Create Categories
// ==========================

function createCategories() {

    const categoriesDiv = document.getElementById("categories");

    categoriesDiv.innerHTML = "";

    // All button
    const allBtn = document.createElement("button");
    allBtn.className = "category active";
    allBtn.innerText = "All";

    allBtn.onclick = () => {

        currentCategory = "All";

        document
            .querySelectorAll(".category")
            .forEach(btn => btn.classList.remove("active"));

        allBtn.classList.add("active");

        filterProducts();

    };

    categoriesDiv.appendChild(allBtn);

    // Other categories
    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(category => {

        const btn = document.createElement("button");

        btn.className = "category";
        btn.innerText = category;

        btn.onclick = () => {

            currentCategory = category;

            document
                .querySelectorAll(".category")
                .forEach(btn => btn.classList.remove("active"));

            btn.classList.add("active");

            filterProducts();

        };

        categoriesDiv.appendChild(btn);

    });

}



// ==========================
// Search + Category Filter
// ==========================

function filterProducts() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const sort = document
        .getElementById("sort")
        .value;

    let filtered = products.filter(product => {

        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;

    });

    if (sort === "low") {

        filtered.sort((a, b) =>
            (a.price ?? a.regular) - (b.price ?? b.regular)
        );

    }

    if (sort === "high") {

        filtered.sort((a, b) =>
            (b.price ?? b.regular) - (a.price ?? a.regular)
        );

    }

    if (sort === "name") {

        filtered.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    displayProducts(filtered);

} {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = products.filter(product => {

        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;

    });

    displayProducts(filtered);

}

function getCategoryIcon(category){

    switch(category){

        case "French Fries": return "🍟";
        case "Burger": return "🍔";
        case "Milk Shakes": return "🥤";
        case "Thick Shakes": return "🥛";
        case "Ice Cream Box": return "🍨";
        case "Ice Cream Scoops": return "🍨";
        case "Classic Mojito": return "🍹";
        case "Boba Coolers": return "🧋";
        case "Boba Shakes": return "🧋";
        case "Maggi": return "🍜";
        case "Momos (Fried)": return "🥟";
        case "Veg Bites": return "🥗";
        case "Non-Veg Bites": return "🍗";
        case "Beverages": return "☕";
        case "Special": return "🔥";
        case "Toppings": return "✨";
        default: return "🍽️";

    }

}


// ==========================
// Display Products
// ==========================

function displayProducts(list) {

    const container = document.getElementById("products");

    container.innerHTML = "";

    list.forEach(product => {

        const vegIcon = product.type === "veg"
            ? '<div class="veg-icon"></div>'
            : '<div class="nonveg-icon"></div>';

        const bestSeller = product.id <= 10
            ? '<span class="badge bestseller">⭐ Bestseller</span>'
            : '';

        const homemade = '<span class="badge homemade">🏠 Homemade</span>';

        let priceSection = "";

        if(product.price){

            priceSection = `

                <div class="single-price">

                    <span class="price">₹${product.price}</span>

                    <button
                    class="add-btn"
                    onclick="addToCart(${product.id})">

                        + Add

                    </button>

                </div>

            `;

        }

        else{

            priceSection = `

                <div class="size-row">

                    <span>Regular ₹${product.regular}</span>

                    <button
                    class="add-btn"
                    onclick="addToCart(${product.id},'regular')">

                        + Add

                    </button>

                </div>

                <div class="size-row">

                    <span>Large ₹${product.large}</span>

                    <button
                    class="add-btn"
                    onclick="addToCart(${product.id},'large')">

                        + Add

                    </button>

                </div>

            `;

        }

        container.innerHTML += `

        <div class="product">

            <div class="product-top">

                ${vegIcon}

                <button class="fav-btn">♡</button>

            </div>

            <div class="product-icon">
    ${getCategoryIcon(product.category)}
</div>

            <div class="product-badges">

                ${homemade}

                ${bestSeller}

            </div>

            <h3>${product.name}</h3>

            <p>${product.category}</p>

            <div class="rating">

                ⭐ 4.8

                <span>(250+)</span>

            </div>

            ${priceSection}

        </div>

        `;

    });

}



// ==========================
// Cart Panel
// ==========================

// Header Cart Button
document.querySelector(".cart-btn").addEventListener("click", () => {

    document
        .getElementById("cart-panel")
        .classList.add("open");

});

// Floating Cart Button
document.getElementById("floating-cart").addEventListener("click", () => {

    document
        .getElementById("cart-panel")
        .classList.add("open");

});

// Close Button
document.getElementById("close-cart").addEventListener("click", () => {

    document
        .getElementById("cart-panel")
        .classList.remove("open");

});

document
.getElementById("checkout")
.addEventListener("click",()=>{

document
.getElementById("checkout-modal")
.classList.add("show");

});

document
.getElementById("close-checkout")
.addEventListener("click",()=>{

document
.getElementById("checkout-modal")
.classList.remove("show");

});