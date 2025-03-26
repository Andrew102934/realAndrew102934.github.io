// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

// Update cart in localStorage
function updateCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  cart.push(item);
  updateCart();
}

// Remove item from cart
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  cart.splice(index, 1);
  updateCart();
}

// Get the cart items
function getCart() {
  return JSON.parse(localStorage.getItem('cart'));
}

// Update cart display
function updateCartDisplay() {
  const cart = getCart();
  let cartHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    cartHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>Quantity: ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    totalPrice += item.price * item.quantity;
  });

  document.getElementById('cart-items').innerHTML = cartHTML;
  document.getElementById('total-price').innerHTML = `$${totalPrice.toFixed(2)}`;
}

// Add to cart from shopping page
function handleAddToCart(name, price) {
  const quantity = parseInt(document.getElementById(name + '-quantity').value);
  if (quantity > 0) {
    addToCart({ name, price, quantity });
    alert(`${name} added to cart!`);
  }
}

// Initialize shopping cart page with cart data
function initializeShoppingPage() {
  const cart = getCart();
  cart.forEach(item => {
    const quantityInput = document.getElementById(item.name + '-quantity');
    if (quantityInput) {
      quantityInput.value = item.quantity;
    }
  });
}

// Handle checkout page
function initializeCheckoutPage() {
  updateCartDisplay();
}

// Confirm order page - Handle payment selection
// Confirm order page - Handle payment selection
function confirmOrder(paymentMethod) {
  const cart = getCart();
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const name = document.getElementById('name').value;  // Get the name from the checkout page
  const dorm = document.getElementById('dorm').value;  // Get the dorm from the checkout page
  
  // Prepare the order details
  const orderDetails = {
    name: name,
    dorm: dorm,
    order: cart,
    total: totalPrice
  };

  // Send order data to Google Apps Script (Web App)
  fetch('https://script.google.com/macros/s/AKfycby7Pte6LczOeD2AIGcWUIZuCMTcxM1VkWyiZpeHPhwUFCB1Mn3RH-7PF5uTdXQw-VVMJQ/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      name: name,
      dorm: dorm,
      order: JSON.stringify(cart),
    })
  })
  .then(response => response.text())
  .then(responseText => {
    console.log(responseText);  // Log response from Google Apps Script (for debugging)
    if (paymentMethod === 'venmo') {
      venmoPayment(totalPrice);  // Redirect to Venmo
    } else if (paymentMethod === 'cash') {
      cashPayment();  // Redirect to cash payment thank-you page
    }
  })
  .catch(error => {
    alert("There was an error submitting your order. Please try again.");
    console.error(error);
  });
}

// Confirm order page - Handle payment button click
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'shopping-page') {
    initializeShoppingPage();
  } else if (document.body.id === 'checkout-page') {
    initializeCheckoutPage();
    // Confirm order logic for Venmo or Cash payment on confirmation page
    const confirmBtn = document.getElementById('confirm-btn');
    confirmBtn.addEventListener('click', () => {
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      if (selectedPayment) {
        confirmOrder(selectedPayment.value);
      } else {
        alert('Please select a payment method');
      }
    });
  }
});
