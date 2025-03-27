document.addEventListener("DOMContentLoaded", function () {
    displayCart(); // Display cart items when the page loads
});

// Initialize cart data from localStorage or set to an empty object
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let prices = { beef: 6, regular: 6, "one-scoop": 3, "two-scoops": 5 };

// Display cart items on checkout page and calculate the total
function displayCart() {
    let cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear the cart container first
    let total = 0;

    // Loop through the cart and display each item
    for (let item in cart) {
        if (cart[item] > 0) {
            let price = prices[item] * cart[item];
            total += price;
            cartContainer.innerHTML += `<p>${item.replace('-', ' ')}: ${cart[item]} - $${price}</p>`;
        }
    }

    // Display the total price
    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Go to the confirmation page
function goToConfirm() {
    const name = document.getElementById('name').value;
    const dorm = document.getElementById('dorm').value;

    if (name && dorm) {
        // Save the name, dorm, and cart data to localStorage
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
