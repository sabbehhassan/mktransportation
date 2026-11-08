# Admin invoice setup

Invoice payment destinations are entered by an authenticated admin for each invoice. They are validated by the backend, saved with that invoice, included in its PDF, and are not read from payment-account environment variables.

The backend still needs its existing SMTP settings in `backend/.env` to email invoices:

- `EMAIL_USER`
- `EMAIL_PASS`
- Optionally `EMAIL_HOST` and `EMAIL_PORT`

The invoice payment method saved on the carrier agreement is used only as a suggested selection. The admin may choose another payment method and must enter the required account holder and payment email/account ID before previewing or sending. The backend recalculates totals and validates invoice dates, selected method, and payment details independently of the frontend.

The invoice APIs remain protected by admin authentication. Do not place SMTP credentials in frontend configuration.
