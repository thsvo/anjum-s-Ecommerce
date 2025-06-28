# SSLCommerz Payment Integration

This document explains how SSLCommerz payment gateway has been integrated into the ecommerce application.

## Features

- **Multiple Payment Methods**: Supports credit/debit cards, mobile banking (bKash, Rocket, Nagad), and internet banking
- **Secure Transactions**: All payments are processed securely through SSLCommerz
- **Payment Status Tracking**: Real-time payment status updates
- **Order Management**: Automatic order status updates based on payment success/failure
- **Fallback Support**: Cash on Delivery option still available

## Configuration

The following environment variables are required for SSLCommerz integration:

```env
SSLCOMMERZ_STORE_ID="anjum685fefcf7abf8"
SSLCOMMERZ_STORE_PASSWORD="anjum685fefcf7abf8@ssl"
SSLCOMMERZ_IS_LIVE=false
NEXTAUTH_URL="http://localhost:3001"
```

## API Endpoints

### Payment Initialization
- **POST** `/api/payment/sslcommerz/init`
- Initializes a payment session with SSLCommerz
- Returns the payment gateway URL for redirection

### Payment Callbacks
- **POST** `/api/payment/sslcommerz/success` - Payment success handler
- **POST** `/api/payment/sslcommerz/fail` - Payment failure handler
- **POST** `/api/payment/sslcommerz/cancel` - Payment cancellation handler
- **POST** `/api/payment/sslcommerz/ipn` - Instant Payment Notification handler

### Payment Validation
- **POST** `/api/payment/sslcommerz/validate`
- Validates payment transactions

## Payment Flow

1. User selects "Online Payment" during checkout
2. Order is created with "SSLCommerz" payment method
3. Payment session is initialized with SSLCommerz
4. User is redirected to SSLCommerz payment gateway
5. After payment, user is redirected back to the application
6. Payment status is validated and order status is updated
7. User sees success/failure page based on payment outcome

## Payment Pages

- `/payment/success` - Payment successful page
- `/payment/failed` - Payment failed page
- `/payment/cancelled` - Payment cancelled page

## Database Schema

The Order model has been updated with the following payment-related fields:

- `paymentTransactionId` - SSLCommerz transaction ID
- `paymentValidationId` - SSLCommerz validation ID
- `paidAt` - Payment completion timestamp

## Payment Methods

### Online Payment (SSLCommerz)
- Credit/Debit Cards (Visa, Mastercard, American Express)
- Mobile Banking (bKash, Rocket, Nagad)
- Internet Banking
- Real-time payment processing

### Cash on Delivery
- Traditional payment method
- Payment collected at delivery
- No online transaction required

## Testing

For testing in sandbox mode:
- Use test card numbers provided by SSLCommerz
- Payments will not be actually processed
- All transactions are simulated

## Security

- All payment data is handled by SSLCommerz
- No sensitive payment information is stored in the application
- SSL encryption for all payment communications
- PCI DSS compliant payment processing

## Error Handling

- Payment failures are gracefully handled
- Users are notified of payment status
- Orders are automatically cancelled for failed payments
- Retry mechanisms available for failed transactions

## Support

For payment-related issues:
1. Check the order status in the admin panel
2. Verify payment status with SSLCommerz dashboard
3. Contact SSLCommerz support for transaction disputes
