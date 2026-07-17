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

// Check if category is ice cream
function isIceCreamCategory(category){
    return category === "Ice Cream Box" || category === "Ice Cream Scoops";
}

// ==========================
// Display Products
// ==========================

function displayProducts(list){

    const container = document.getElementById("category-products");

    container.innerHTML = "";

    // Group products by category
    const grouped = {};

    list.forEach(product => {

        if(!grouped[product.category]){
            grouped[product.category] = [];
        }

        grouped[product.category].push(product);

    });

    Object.keys(grouped).forEach(category=>{

        const categoryCard = document.createElement("div");
        categoryCard.className = "category-card";

        const header = document.createElement("div");
        header.className = "category-header";

        header.innerHTML = `
            <div>
                <h2>${getCategoryIcon(category)} ${category}</h2>
                <small>${grouped[category].length} Items</small>
            </div>

            <button class="toggle-btn">+</button>
        `;

        const productsDiv = document.createElement("div");
        productsDiv.className = "category-products";

        header.onclick = ()=>{

            productsDiv.classList.toggle("show");

            header.querySelector(".toggle-btn").textContent =
                productsDiv.classList.contains("show")
                ? "−"
                : "+";

        };

        // Products will be added here in the next step

        categoryCard.appendChild(header);
        categoryCard.appendChild(productsDiv);

        container.appendChild(categoryCard);

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
