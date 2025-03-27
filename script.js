document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", sendOrderEmail);
    }

    updateDisplay(); // Ensure correct quantities display on load
});

// Load cart from local storage
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let prices = { beef: 6, regular: 6, "one-scoop": 3, "two-scoops": 5 };

// Ensure all items exist in cart to prevent errors
if (!cart.beef) cart.beef = 0;
if (!cart.regular) cart.regular = 0;
if (!cart["one-scoop"]) cart["one-scoop"] = 0;
if (!cart["two-scoops"]) cart["two-scoops"] = 0;

// Update quantity display
function updateDisplay() {
    document.getElementById("beef-qty").innerText = cart.beef;
    document.getElementById("regular-qty").innerText = cart.regular;
    document.getElementById("one-scoop-qty").innerText = cart["one-scoop"];
    document.getElementById("two-scoops-qty").innerText = cart["two-scoops"];
}

// Adjust item quantity
function changeQuantity(item, amount) {
    if (cart[item] + amount >= 0) {
        cart[item] += amount;
    }
    updateDisplay();
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Display cart items on checkout page
function displayCart() {
    let cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        if (cart[item] > 0) {
            let price = prices[item] * cart[item];
            total += price;
            cartContainer.innerHTML += `<p>${cart[item]}x ${item.replace("-", " ")} - $${price}</p>`;
        }
    }
    document.getElementById("total-price").innerText = total.toFixed(2);
}
emailjs.init('g5CBsjjNcxqlJfquQ'); // Replace with your actual Public Key

function sendOrderEmail() {
    const name = document.getElementById("name").value;
    const dorm = document.getElementById("dorm").value;

    if (name && dorm) {
        let cartDetails = "";
        let total = 0;

        for (let item in cart) {
            if (cart[item] > 0) {
                let itemTotal = prices[item] * cart[item];
                total += itemTotal;
                cartDetails += `${cart[item]}x ${item.replace("-", " ")} ($${itemTotal})%0D%0A`;
            }
        }

        let subject = "New Order from Conc-A-Noodle";
        let body = `Name: ${name}%0D%0A`
                  + `Dorm: ${dorm}%0D%0A`
                  + `Order:%0D%0A${cartDetails}%0D%0A`
                  + `Total: $${total.toFixed(2)}`;

        // Send the email using EmailJS
        emailjs.send('service_fehqca1', 'template_3hwjv1l', {
            from_name: name,
            from_dorm: dorm,
            order_details: cartDetails,
            total_price: total.toFixed(2),
            subject: subject,
            body: body,
        })
        .then(function(response) {
            console.log('Success:', response);
            alert("Your order has been submitted successfully!");
            localStorage.removeItem("cart");  // Clear cart after order
            window.location.href = "thank-you.html";  // Redirect to the Thank You page
        }, function(error) {
            console.error('Error:', error);
            alert("There was an issue submitting your order. Please try again.");
        });
    } else {
        alert("Please fill out both your name and dorm.");
    }
}




// Go to checkout page
function goToCheckout() {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Go back to the shopping page
function goBack() {
    window.location.href = "index.html";
}
