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

// Send order via email using EmailJS
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

        // Now, we will use EmailJS to send the email
        emailjs.send("service_id", "template_id", {
            from_name: name,
            from_email: "user_email@example.com", // Use a default email or get from user input if needed
            subject: subject,
            content: body,
            to_email: "and.sallad@gmail.com", // Your email address
        })
        .then(function(response) {
            console.log("SUCCESS!", response);
            alert("Your order has been confirmed and sent via email.");
            localStorage.removeItem("cart"); // Clear cart after sending the order
            window.location.href = "thank-you.html"; // Redirect to thank you page
        }, function(error) {
            console.log("FAILED...", error);
            alert("There was an issue with your order. Please try again.");
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
