
// Select HTML Elements
const categoryLinks = document.querySelectorAll(".category-link");
const products = document.querySelectorAll(".product-card");
const searchInput = document.querySelector("#search-input");

const cartButton = document.querySelector("#cart-button");
const cartPopup = document.querySelector("#cart-popup");
const closeCart = document.querySelector("#close-cart");

const cartCountElement = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");


// Create Variables
let selectedCategory = "all";
let cart = {};

const originalButtons = new Map();


// Store Original Product Buttons
products.forEach(function(product, index) {

    product.dataset.productId = index;

    const addButton = product.querySelector(".add-to-cart");

    if (addButton) {
        originalButtons.set(index, addButton.cloneNode(true));
    }

});


// Get Product Information
function getProductInfo(product) {

    const image = product.querySelector("img");

    const heading = product.querySelector("h1, h2, h3, h4");

    const productName = heading
        ? heading.innerText.trim()
        : product.innerText.split("\n").find(function(line) {
            return line.trim() !== "" &&
                !line.includes("₹") &&
                !line.toLowerCase().includes("add");
        }).trim();

    const priceMatch = product.innerText.match(/₹\s*([\d,]+)/);

    const price = priceMatch
        ? Number(priceMatch[1].replace(",", ""))
        : 0;

    return {
        name: productName,
        price: price,
        image: image ? image.src : ""
    };

}


// Category Filter Function
function filterProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    products.forEach(function(product) {

        const productCategory = product.dataset.category;
        const productName = product.innerText.toLowerCase();

        const categoryMatch =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        const searchMatch =
            productName.includes(searchValue);

        if (categoryMatch && searchMatch) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }

    });

}


// Category Click Event
categoryLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        selectedCategory = link.dataset.category;

        filterProducts();

    });

});


// Search Product Event
searchInput.addEventListener("input", function() {

    filterProducts();

});


// Update Product Quantity Buttons
function updateProductControls(product) {

    const productId = product.dataset.productId;
    const quantity = cart[productId].quantity;

    let control = product.querySelector(".quantity-control");

    if (quantity > 0) {

        if (!control) {

            const oldButton = product.querySelector(".add-to-cart");

            control = document.createElement("div");

            control.className =
                "quantity-control flex items-center justify-between gap-3 bg-green-600 text-white rounded-lg px-3 py-2";

            oldButton.replaceWith(control);

        }

        control.innerHTML = `
            <button class="cart-minus px-2 font-bold">−</button>
            <span>${quantity}</span>
            <button class="cart-plus px-2 font-bold">+</button>
        `;

    } else {

        if (control) {

            const originalButton = originalButtons.get(Number(productId));

            control.replaceWith(originalButton.cloneNode(true));

        }

    }

}


// Add, Increase and Decrease Product Quantity
document.addEventListener("click", function(event) {

    const addButton = event.target.closest(".add-to-cart");
    const plusButton = event.target.closest(".cart-plus");
    const minusButton = event.target.closest(".cart-minus");

    // Add Product
    if (addButton) {

        const product = addButton.closest(".product-card");
        const productId = product.dataset.productId;

        const info = getProductInfo(product);

        cart[productId] = {
            ...info,
            quantity: 1
        };

        updateProductControls(product);
        updateCart();

    }

    // Increase Quantity
    if (plusButton) {

        const product = plusButton.closest(".product-card");
        const productId = product.dataset.productId;

        cart[productId].quantity++;

        updateProductControls(product);
        updateCart();

    }

    // Decrease Quantity
    if (minusButton) {

        const product = minusButton.closest(".product-card");
        const productId = product.dataset.productId;

        cart[productId].quantity--;

        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }

        updateProductControls(product);
        updateCart();

    }

});


// Update Cart Count and Total Price
function updateCart() {

    let totalItems = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(function(item) {

        totalItems += item.quantity;

        totalPrice += item.price * item.quantity;

    });

    cartCountElement.innerText = totalItems;
    cartTotal.innerText = totalPrice;
    displayCartProducts();

}


// Display Cart Products
function displayCartProducts() {

    cartItems.innerHTML = "";

    const cartProducts = Object.entries(cart);

    if (cartProducts.length === 0) {

        cartItems.innerHTML = `
            <p class="text-gray-500 text-center py-8">
                Your cart is empty
            </p>
        `;

        return;

    }

    cartProducts.forEach(function([productId, item]) {

        const productDiv = document.createElement("div");

        productDiv.className =
            "flex items-center gap-3 border-b py-4";

        productDiv.innerHTML = `
            <img src="${item.image}"
                class="w-16 h-16 object-contain">

            <div class="flex-1">

                <h3 class="font-semibold text-sm">
                    ${item.name}
                </h3>

                <p class="text-gray-500 text-sm">
                    ₹${item.price}
                </p>

                <p class="text-green-700 font-semibold text-sm">
                    Quantity: ${item.quantity}
                </p>

                <p class="font-bold">
                    ₹${item.price * item.quantity}
                </p>

            </div>
        `;

        cartItems.appendChild(productDiv);

    });

}


// Open Cart Popup
cartButton.addEventListener("click", () => {

    cartPopup.classList.toggle("hidden");

});


// Close Cart Popup
closeCart.addEventListener("click", function() {

    cartPopup.classList.add("hidden");

});


// Initial Cart Update
updateCart();

console.log("Category Page JavaScript Started");
