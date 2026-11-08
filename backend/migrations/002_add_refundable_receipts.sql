CREATE TABLE IF NOT EXISTS deposit_payment_verifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  agreement_id BIGINT UNSIGNED NOT NULL,
  amount_received DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_date DATE NOT NULL,
  payment_reference VARCHAR(160) NULL,
  status ENUM('verified', 'revoked') NOT NULL DEFAULT 'verified',
  verified_by VARCHAR(255) NOT NULL,
  verified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_by VARCHAR(255) NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY deposit_verifications_agreement_status (agreement_id, status, id),
  CONSTRAINT deposit_verifications_agreement_fk
    FOREIGN KEY (agreement_id) REFERENCES agreements(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refundable_receipt_settings (
  id TINYINT UNSIGNED NOT NULL,
  company_name VARCHAR(160) NOT NULL,
  company_brand VARCHAR(160) NOT NULL,
  company_website VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL,
  company_phone VARCHAR(80) NULL,
  physical_address VARCHAR(255) NULL,
  mailing_address VARCHAR(255) NULL,
  mc_number VARCHAR(80) NULL,
  usdot_number VARCHAR(80) NULL,
  logo_data_url MEDIUMTEXT NULL,
  refund_policy TEXT NOT NULL,
  authorized_name VARCHAR(160) NULL,
  authorized_position VARCHAR(160) NULL,
  signature_data_url MEDIUMTEXT NULL,
  updated_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS refundable_receipts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  invoice_id BIGINT UNSIGNED NOT NULL,
  agreement_id BIGINT UNSIGNED NOT NULL,
  deposit_verification_id BIGINT UNSIGNED NOT NULL,
  receipt_number VARCHAR(48) NOT NULL,
  amount_received DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_date DATE NOT NULL,
  payment_reference VARCHAR(160) NULL,
  receipt_data LONGTEXT NOT NULL,
  pdf_data MEDIUMBLOB NULL,
  status ENUM('draft', 'sent', 'failed') NOT NULL DEFAULT 'draft',
  email_sent_to VARCHAR(255) NULL,
  email_sent_at DATETIME NULL,
  email_lock_at DATETIME NULL,
  last_error VARCHAR(1000) NULL,
  created_by_admin VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY refundable_receipts_invoice_unique (invoice_id),
  UNIQUE KEY refundable_receipts_number_unique (receipt_number),
  KEY refundable_receipts_agreement_index (agreement_id),
  CONSTRAINT refundable_receipts_invoice_fk
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    ON DELETE CASCADE,
  CONSTRAINT refundable_receipts_agreement_fk
    FOREIGN KEY (agreement_id) REFERENCES agreements(id)
    ON DELETE CASCADE,
  CONSTRAINT refundable_receipts_payment_fk
    FOREIGN KEY (deposit_verification_id)
    REFERENCES deposit_payment_verifications(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS refundable_receipt_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  receipt_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(32) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  detail VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY refundable_receipt_events_receipt_index (receipt_id, id),
  CONSTRAINT refundable_receipt_events_receipt_fk
    FOREIGN KEY (receipt_id) REFERENCES refundable_receipts(id)
    ON DELETE CASCADE
);
