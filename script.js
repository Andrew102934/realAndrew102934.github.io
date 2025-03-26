document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cart-items")) {
        displayCart();
    }

    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", goToConfirm);
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

// Submit order to Google Apps Script
function goToConfirm() {
    const name = document.getElementById("name").value;
    const dorm = document.getElementById("dorm").value;

    if (name && dorm) {
        let cartDetails = [];
        for (let item in cart) {
            if (cart[item] > 0) {
                cartDetails.push({
                    item: item.replace("-", " "),
                    quantity: cart[item],
                    price: prices[item],
                    total: prices[item] * cart[item],
                });
            }
        }

        const orderData = {
            name: name,
            dorm: dorm,
            order: cartDetails,
            total: cartDetails.reduce((sum, item) => sum + item.total, 0), // Calculate total
        };

        fetch(
            "https://script.google.com/macros/s/AKfycbzBvdYdfLpTTgjGTd-3kC75jlh5UQYSoQmmUikCumKKAMOMMtE1B5zVbQ_yxE_m__rJpg/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Order submitted:", data);
                alert("Order confirmed! Thank you!");
                window.location.href = "thank-you.html";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("There was an issue with your order. Please try again.");
            });
    } else {
        alert("Please fill out both your name and dorm.");
    }
}

// Go back to the shopping page
function goBack() {
    window.location.href = "index.html";
}
