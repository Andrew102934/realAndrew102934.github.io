document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cart-items")) {
        displayCart();
    }
});

// Initialize cart data from localStorage or set to an empty object
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let prices = { beef: 6, regular: 6, "one-scoop": 3, "two-scoops": 5 };
let selectedPayment = '';

// Add items to cart
function addToCart(item) {
    cart[item] = (cart[item] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// Go to the checkout page
function goToCheckout() {
    window.location.href = 'checkout.html'; // Redirect to checkout page
}

// Display cart items on checkout page
function displayCart() {
    let cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear cart container first
    let total = 0;

    // Loop through the cart and display each item
    for (let item in cart) {
        if (cart[item] > 0) {
            let price = prices[item] * cart[item];
            total += price;
            cartContainer.innerHTML += `<p>${cart[item]}x ${item.replace('-', ' ')} - $${price}</p>`;
        }
    }

    // Display the total price
    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Go to the confirmation page and save order data to localStorage
function goToConfirm() {
    const name = document.getElementById('name').value;
    const dorm = document.getElementById('dorm').value;

    if (name && dorm) {
        const orderData = {
            name: name,
            dorm: dorm,
            cart: cart,
            totalPrice: document.getElementById('total-price').innerText
        };
        localStorage.setItem('orderData', JSON.stringify(orderData));
        window.location.href = 'confirm.html'; // Redirect to the confirm page
    } else {
        alert("Please fill out both your name and dorm.");
    }
}

// Go back to the shopping page
function goBack() {
    window.location.href = 'index.html'; // Redirect to the shopping page
}

// Select payment method (Venmo or Cash)
function selectPayment(method) {
    selectedPayment = method;
    document.getElementById('confirm-btn').disabled = false; // Enable the Confirm button
}

// Confirm the order and proceed to the next step (for now, just alert)
function confirmOrder() {
    const orderData = JSON.parse(localStorage.getItem('orderData'));

    if (selectedPayment) {
        alert(`Order confirmed! Payment method: ${selectedPayment}. Total: $${orderData.totalPrice}`);
        localStorage.removeItem('cart'); // Clear the cart
        window.location.href = 'thank-you.html'; // Redirect to a "Thank You" page
    } else {
        alert("Please select a payment method.");
    }
}
