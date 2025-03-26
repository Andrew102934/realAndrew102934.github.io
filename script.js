document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cart-items")) {
        displayCart();
    }

    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", sendOrderEmail);
    }
});

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let prices = { beef: 6, regular: 6, "one-scoop": 3, "two-scoops": 5 };

// Display cart items in the checkout page
function displayCart() {
    let cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        if (cart[item] > 0) {
            let price = prices[item] * cart[item];
            total += price;
            cartContainer.innerHTML += `<p>${item.replace("-", " ")}: ${cart[item]} - $${price}</p>`;
        }
    }
    document.getElementById("total-price").innerText = total.toFixed(2);
}

// Send order via email
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

        let mailtoLink = `mailto:and.sallad@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;

        alert("Order email will be sent via your default email client.");
        localStorage.removeItem("cart");  // Clear cart after order is placed
        window.location.href = "thank-you.html";
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
