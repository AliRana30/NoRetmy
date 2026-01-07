const express = require('express');
const { createCustomerAndPaymentIntent,withdrawFunds,processRefund } = require('../controllers/PaymentController');
const { handleStripeWebhook } = require('../controllers/stripeWebhookController');
const bodyParser = require('body-parser');

const router = express.Router();

// Define the route for creating a payment intent
router.post('/create-payment-intent', createCustomerAndPaymentIntent);

// Use comprehensive webhook handler with proper order progress and promotion handling
// Raw body parsing handled by express.raw in server.js BEFORE this route
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.post('/withdraw', withdrawFunds);

// Route for processing refunds
router.post('/refund', processRefund);

module.exports = router;
