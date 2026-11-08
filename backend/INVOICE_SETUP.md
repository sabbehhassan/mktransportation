# Admin invoice setup

Invoice payment destinations are entered by an authenticated admin for each invoice. They are validated by the backend, saved with that invoice, included in its PDF, and are not read from payment-account environment variables.

The backend uses Hostinger Business Email SMTP settings in `backend/.env` for all outgoing mail:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

The invoice payment method saved on the carrier agreement is used only as a suggested selection. The admin may choose another payment method and must enter the required account holder and payment email/account ID before previewing or sending. The backend recalculates totals and validates invoice dates, selected method, and payment details independently of the frontend.

The invoice APIs remain protected by admin authentication. Do not place SMTP credentials in frontend configuration.

## Refundable deposit receipts

Apply the SQL migrations in order (`001_add_invoice_support.sql`, then
`002_add_refundable_receipts.sql`) to the configured MySQL database before
starting the updated backend. The second migration adds an audited deposit
verification record, private receipt settings, one receipt per invoice, and
receipt delivery history without removing existing invoice or agreement data.

When an admin verifies a deposit, the admin panel now records its received
amount, payment method, payment date, and optional reference. Previously
verified agreements need their payment details recorded using **Update Payment
Record** before a receipt can be issued. Reverting a deposit to pending revokes
its active verification record and blocks new receipts. Load eligibility still
uses the agreement's manually verified `deposit_status`; neither invoice nor
receipt email changes that status or assigns a load.

In Invoice History, an admin can preview and download a draft receipt, review
the saved refund-policy text, and send it to the carrier email on the agreement.
The receipt PDF and its company, payment, policy, and authorization snapshots
are stored privately with the receipt. Duplicate receipts are prevented per
invoice; a sent receipt can be viewed, downloaded, or resent.

Use **Receipt Settings** in the receipt interface to configure the company
details, refund policy, and approved logo. Configure the authorized
representative name, job title, and genuine approved signature image before
sending. The form does not prefill a representative identity or signature.
The initial refund-policy wording is derived from the existing agreement terms;
the admin must review and confirm the policy for each receipt before sending.

Receipt preview, settings, send, download, and resend endpoints are protected
by the existing admin authentication. Receipt settings and PDF data are not
served publicly. Receipt emails reuse the backend's existing SMTP environment
variables.
