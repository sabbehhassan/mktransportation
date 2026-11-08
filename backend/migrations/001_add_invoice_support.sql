ALTER TABLE agreements
  ADD COLUMN payment_terms_method VARCHAR(100) NULL AFTER payment_method;

CREATE TABLE invoices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  agreement_id BIGINT UNSIGNED NOT NULL,
  tracking_id VARCHAR(64) NOT NULL,
  invoice_number VARCHAR(40) NOT NULL,
  status ENUM('pending', 'sent', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
  invoice_data LONGTEXT NOT NULL,
  email_lock_at DATETIME NULL,
  sent_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY invoices_number_unique (invoice_number),
  KEY invoices_agreement_id_index (agreement_id),
  KEY invoices_tracking_id_index (tracking_id)
);
