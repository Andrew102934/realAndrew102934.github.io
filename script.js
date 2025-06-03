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
function confirmOrder(paymentMethod) {
  const cart = getCart();
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  if (paymentMethod === 'venmo') {
    venmoPayment(totalPrice); // Redirect to Venmo with the total price
  } else if (paymentMethod === 'cash') {
    cashPayment(); // Redirect to thank you page for cash payment
  } else {
    alert('Please select a payment method!');
  }
}

// Venmo payment redirection
function venmoPayment(amount) {
  const venmoURL = `https://venmo.com/?txn=pay&amount=${amount}&recipients=@Andrew-Salladin`;
  window.location.href = venmoURL; // Redirect to Venmo
}

// Cash payment redirection
function cashPayment() {
  window.location.href = 'thank-you.html'; // Redirect to thank you page for cash payment
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

