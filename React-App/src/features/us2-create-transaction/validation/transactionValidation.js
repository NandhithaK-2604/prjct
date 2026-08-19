const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PAYEE_ACCOUNT_REGEX = /^[0-9]{9,18}$/;
const PAYEE_NAME_REGEX = /^[A-Za-z\s.'-]{2,100}$/;


// Validate one payment row
export function validatePayment(row) {
  const errors = {};

  if (!row.payeeName || !row.payeeName.trim()) {
    errors.payeeName = "Enter the payee's name.";
  } else if (!PAYEE_NAME_REGEX.test(row.payeeName.trim())) {
    errors.payeeName = 'Invalid payee name.';
  }


  if (!row.payeeAccountNumber) {
    errors.payeeAccountNumber =
      "Enter the payee's account number.";
  } else if (
    !PAYEE_ACCOUNT_REGEX.test(row.payeeAccountNumber)
  ) {
    errors.payeeAccountNumber =
      'Account number should be 9–18 digits.';
  }


  if (!row.ifsc) {
    errors.ifsc = 'Enter the IFSC code.';
  } else if (!IFSC_REGEX.test(row.ifsc.toUpperCase())) {
    errors.ifsc = 'Enter a valid IFSC code.';
  }


  const amount = Number(row.amount);

  if (!row.amount) {
    errors.amount = 'Enter an amount.';
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be greater than 0.';
  }


  return errors;
}


// Validate complete batch
export function validateBatch(batch, selectedAccount) {
  const errors = {
    batch: {},
    rows: [],
  };


  // Debit account
  if (!batch.debitAccount) {
    errors.batch.debitAccount =
      'Select a debit account.';
  }


  // Date
  if (!batch.date) {
    errors.batch.date =
      'Select a transaction date.';
  } else {
    const chosen = new Date(batch.date);
    const today = new Date();

    today.setHours(23, 59, 59, 999);

    if (chosen > today) {
      errors.batch.date =
        'Date cannot be in the future.';
    }
  }


  // Department
  if (!batch.department) {
    errors.batch.department =
      'Select a department.';
  }


  // Cost center
  if (!batch.costCenter) {
    errors.batch.costCenter =
      'Enter a cost center.';
  }


  // Currency
  if (!batch.currency) {
    errors.batch.currency =
      'Select a payment currency.';
  }


  // Currency must match debit account
  if (
    selectedAccount &&
    batch.currency !== selectedAccount.currency
  ) {
    errors.batch.currency =
      `Payment currency must match the debit account currency (${selectedAccount.currency}).`;
  }


  // At least one payment
  if (
    !batch.transactions ||
    batch.transactions.length === 0
  ) {
    errors.batch.transactions =
      'Add at least one payment.';
  }


  // Validate every payment row
  batch.transactions.forEach((row) => {
    errors.rows.push(validatePayment(row));
  });


  // Total amount
  const total = batch.transactions.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );


  if (
    selectedAccount &&
    total > selectedAccount.balance
  ) {
    errors.batch.total =
      `Total batch amount exceeds available balance of ${selectedAccount.balance}.`;
  }


  // Remove empty row errors
  if (
    errors.rows.every(
      (row) => Object.keys(row).length === 0
    )
  ) {
    delete errors.rows;
  }


  if (Object.keys(errors.batch).length === 0) {
    delete errors.batch;
  }


  return errors;
}