let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
}

function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let div = document.createElement("div");
        div.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.quantity}</p>
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <button onclick="updateQuantity(${index}, 1)">+</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItems.appendChild(div);
        total += item.price * item.quantity;
    });

    totalPrice.innerText = total.toFixed(2);
    localStorage.setItem("cartTotal", total.toFixed(2)); // Store total for checkout
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function displayCheckout() {
    let orderSummary = document.getElementById("order-summary");
    let checkoutTotal = document.getElementById("checkout-total");
    if (!orderSummary) return;

    orderSummary.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        let p = document.createElement("p");
        p.innerText = `${item.name} - $${item.price} x ${item.quantity}`;
        orderSummary.appendChild(p);
        total += item.price * item.quantity;
    });

    checkoutTotal.innerText = total.toFixed(2);
    localStorage.setItem("cartTotal", total.toFixed(2)); // Store total for checkout
}

// Save order to admin page (NEW FUNCTION)
document.getElementById('confirmOrderBtn')?.addEventListener('click', () => {
    const dorm = document.getElementById("dorm").value;
    const dormInfo = document.getElementById("dorm-input").value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value || "Not selected";

    let orderDetails = cart.map(item => `${item.quantity}x ${item.name}`).join(", ");
    
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({ details: orderDetails, dorm, dormInfo, payment });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order confirmed!");
    window.location.href = "checkout2.html"; // Redirect to payment page
});

window.onload = function () {
    displayCart();
    displayCheckout();
};

document.addEventListener("DOMContentLoaded", function () {
    const totalAmount = parseFloat(localStorage.getItem("cartTotal")) || 0.00;
    const venmoUsername = "Andrew-Salladin";
    const venmoButton = document.getElementById("venmoButton");

    // Update Venmo Button with Payment Link
    venmoButton.href = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${totalAmount}&note=Conc-a-Noodle Order`;

    // Add backup for desktop users
    venmoButton.addEventListener("click", function (e) {
        if (!navigator.userAgent.match(/Android|iPhone|iPad/i)) {
            e.preventDefault();
            window.open(`https://venmo.com/${venmoUsername}?txn=pay&amount=${totalAmount}&note=Conc-a-Noodle Order`, "_blank");
        }
    });

    // Load cart total
    document.getElementById("checkout-total").innerText = totalAmount.toFixed(2);
});

function chooseIceCream(name, price, selectId) {
    const flavorSelect = document.getElementById(selectId);
    const selectedFlavor = flavorSelect.options[flavorSelect.selectedIndex].value;

    if (selectedFlavor) {
        alert(`${name} with ${selectedFlavor.charAt(0).toUpperCase() + selectedFlavor.slice(1)} flavor added to cart!`);
        addToCart(`${name} (${selectedFlavor.charAt(0).toUpperCase() + selectedFlavor.slice(1)})`, price);
    } else {
        alert("No flavor selected. Please choose a flavor.");
    }
}

function showDormInput() {
    const dormSelect = document.getElementById('dorm');
    const dormInputContainer = document.getElementById('dorm-input-container');
    const dormLabel = document.getElementById('dorm-label');
    const dormInput = document.getElementById('dorm-input');

    const selectedDorm = dormSelect.value;

    if (selectedDorm === "rho" || selectedDorm === "sigma" || selectedDorm === "uppers" || selectedDorm === "lowers") {
        dormInputContainer.style.display = 'block';
        dormLabel.innerText = "Enter your room number:";
        dormInput.type = "number";
    } else if (selectedDorm === "other") {
        dormInputContainer.style.display = 'block';
        dormLabel.innerText = "Enter your dorm name or custom location:";
        dormInput.type = "text";
    } else {
        dormInputContainer.style.display = 'none';
    }
}
