document
  .getElementById("topupForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const gameID = document.getElementById("gameID").value;
    const amount = document.getElementById("amount").value;
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const result = await response.json();

    if (result.clientSecret) {
      // Use Stripe.js to handle payment confirmation
      const stripe = Stripe("your_stripe_public_key");
      const { error } = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: {
            number: "4242424242424242", // contoh nomor kartu
            exp_month: 12,
            exp_year: 2023,
            cvc: "123",
          },
          billing_details: {
            name: "Jenny Rosen",
          },
        },
      });
      if (error) {
        document.getElementById("message").innerText = "Payment failed!";
      } else {
        document.getElementById("message").innerText = "Payment successful!";
      }
    } else {
      document.getElementById("message").innerText = result.error;
    }
  });
