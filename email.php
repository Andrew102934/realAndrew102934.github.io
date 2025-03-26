<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "and.sallad@gmail.com"; // Your email address
    $subject = "New Order from Conc-A-Noodle";
    
    // Get order data from the POST request
    $name = $_POST['name'];
    $dorm = $_POST['dorm'];
    $cart = json_decode($_POST['cart'], true);
    $paymentMethod = $_POST['paymentMethod'];
    $totalPrice = $_POST['totalPrice'];
    
    // Format the email message
    $message = "New order details:\n\n";
    $message .= "Name: $name\n";
    $message .= "Dorm: $dorm\n";
    $message .= "Payment Method: $paymentMethod\n";
    $message .= "Total Price: $$totalPrice\n\n";
    $message .= "Cart Items:\n";
    
    foreach ($cart as $item) {
        $message .= $item['item'] . " x" . $item['quantity'] . " - $" . $item['total'] . "\n";
    }
    
    // Set email headers
    $headers = "From: no-reply@conc-a-noodle.me" . "\r\n" . "Reply-To: no-reply@conc-a-noodle.me" . "\r\n";
    
    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "Order sent successfully!";
    } else {
        echo "Error sending order.";
    }
}
?>
