// Your existing cart functions here (addToCart, removeFromCart, getCart, etc.)...

// New async confirmOrder function:
async function confirmOrder(paymentMethod) {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Prepare data to send to Formspree
  const name = JSON.parse(localStorage.getItem('userInfo'))?.name || '';
  const dorm = JSON.parse(localStorage.getItem('userInfo'))?.dorm || '';

  let cartText = '';
  cart.forEach(item => {
    cartText += `${item.name}: Quantity ${item.quantity}\n`;
  });

  const formData = new FormData();
  formData.append('name', name);
  formData.append('dorm', dorm);
  formData.append('cart', cartText.trim());
  formData.append('total', totalPrice.toFixed(2));
  formData.append('payment', paymentMethod);
  formData.append('_subject', 'New Conc-A-Noodle Order!');

  try {
    const response = await fetch('https://formspree.io/f/mwpbkwoq', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      alert('Failed to send order email. Please try again.');
      return;
    }

    // Email sent successfully — now redirect based on payment method
    if (paymentMethod === 'venmo') {
      venmoPayment(totalPrice.toFixed(2));
    } else if (paymentMethod === 'cash') {
      cashPayment();
    }
  } catch (error) {
    alert('Error sending email: ' + error.message);
  }
}

// Venmo and cash payment functions remain the same

function venmoPayment(amount) {
  const venmoURL = `https://venmo.com/?txn=pay&amount=${amount}&recipients=@Andrew-Salladin`;
  window.location.href = venmoURL;
}

function cashPayment() {
  window.location.href = 'thank-you.html';
}

// Event listener for confirm button
document.addEventListener('DOMContentLoaded', () => {
  // Your existing initialization code here (shopping page, checkout page)...

  // For confirm page, handle confirm button click:
  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      if (!selectedPayment) {
        alert('Please select a payment method');
        return;
      }
      confirmOrder(selectedPayment.value);
    });
  }
});
