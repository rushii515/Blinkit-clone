// ---------- Select HTML elements ----------
const grid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const noResults = document.querySelector("#no-results");
const clearButton = document.querySelector("#clear-filters");

const priceBoxes = document.querySelectorAll('input[name="price"]');
const brandBoxes = document.querySelectorAll('input[name="brand"]');

// Save all product cards in their original order (used for "Relevance" sort)
const allCards = Array.from(grid.children);


// ---------- Helper functions ----------

// Read the price from the card, e.g. "₹1,260" -> 1260
function getPrice(card) {
    const priceText = card.querySelector("span.font-bold").innerText;
    return Number(priceText.replace(/[^\d]/g, ""));
}

// Read the brand from the product name, e.g. "Amul Masti Cup Curd" -> "amul"
function getBrand(card) {
    const name = card.querySelector("h3").innerText.trim();
    return name.split(" ")[0].toLowerCase();
}

// Get the values of all checked checkboxes in a group
function getChecked(boxes) {
    return Array.from(boxes)
        .filter(function (box) { return box.checked; })
        .map(function (box) { return box.value; });
}

// Check if a price fits in the selected price ranges
function priceMatches(price, selectedRanges) {
    if (selectedRanges.length === 0) return true;

    return selectedRanges.some(function (range) {
        if (range === "under50") return price < 50;
        if (range === "50to99") return price >= 50 && price <= 99;
        if (range === "100plus") return price >= 100;
        return false;
    });
}


// ---------- Main function ----------
function applyFilters() {
    const selectedPrices = getChecked(priceBoxes);
    const selectedBrands = getChecked(brandBoxes);
    const searchValue = searchInput.value.toLowerCase().trim();

    // Step 1: find the cards that match all filters
    let visibleCards = allCards.filter(function (card) {
        const name = card.querySelector("h3").innerText.toLowerCase();

        const priceOk = priceMatches(getPrice(card), selectedPrices);
        const brandOk = selectedBrands.length === 0 || selectedBrands.includes(getBrand(card));
        const searchOk = name.includes(searchValue);

        return priceOk && brandOk && searchOk;
    });

    // Step 2: sort the visible cards
    if (sortSelect.value === "low") {
        visibleCards.sort(function (a, b) { return getPrice(a) - getPrice(b); });
    } else if (sortSelect.value === "high") {
        visibleCards.sort(function (a, b) { return getPrice(b) - getPrice(a); });
    }
    // "relevance" keeps the original order

    // Step 3: hide all cards, then show and reorder the matching ones
    allCards.forEach(function (card) {
        card.style.display = "none";
    });

    visibleCards.forEach(function (card) {
        card.style.display = "";
        grid.appendChild(card); // moves the card to the end, so the order follows the sort
    });

    // Step 4: update the count and the "no products" message
    resultCount.innerText = visibleCards.length + " products found";
    noResults.classList.toggle("hidden", visibleCards.length > 0);
}


// ---------- Events ----------
priceBoxes.forEach(function (box) {
    box.addEventListener("change", applyFilters);
});

brandBoxes.forEach(function (box) {
    box.addEventListener("change", applyFilters);
});

sortSelect.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// Clear all filters
clearButton.addEventListener("click", function () {
    priceBoxes.forEach(function (box) { box.checked = false; });
    brandBoxes.forEach(function (box) { box.checked = false; });
    searchInput.value = "";
    sortSelect.value = "relevance";
    applyFilters();
});

// Run once when the page loads
applyFilters();