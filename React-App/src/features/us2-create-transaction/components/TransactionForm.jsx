import PaymentRow from './PaymentRow';
import FormField from './FormField';
import TransactionSummary from './TransactionSummary';

import { useTransactionForm } from '../hooks/useTransactionForm';

import { formatCurrency } from '../utils/formatCurrency';

import styles from '../styles/TransactionForm.module.css';


export default function TransactionForm() {

  const {

    accounts,
    accountsLoading,
    selectedAccount,

    batchData,
    batchErrors,
    rowErrors,

    submitting,
    submitError,
    result,

    saveState,

    handleBatchChange,
    handleRowChange,
    handleRowBlur,

    addPayment,
    removePayment,

    handleSubmit,
    resetForm,

  } = useTransactionForm();


  // -----------------------------
  // Submitted batch screen
  // -----------------------------

  if (result) {

    return (
      <TransactionSummary
        result={result}
        onCreateAnother={resetForm}
      />
    );

  }


  // -----------------------------
  // Calculate total
  // -----------------------------

  const totalAmount =
    batchData.transactions.reduce(
      (sum, transaction) =>
        sum + (Number(transaction.amount) || 0),
      0
    );


  return (

    <form
      className={styles.card}
      onSubmit={(event) => {

        event.preventDefault();

        handleSubmit();

      }}

      noValidate
    >


      {/* =========================
          INSTRUCTION DETAILS
      ========================== */}

      <section className={styles.section}>

        <h2 className={styles.sectionTitle}>
          Instruction Details
        </h2>


        <div className={styles.row}>

          <FormField
            label="Payment Type"
            error={batchErrors.paymentType}
            touched={true}
          >

            <select
              className={styles.input}
              value={batchData.paymentType}

              onChange={(event) =>
                handleBatchChange(
                  'paymentType',
                  event.target.value
                )
              }
            >

              <option value="DOMESTIC">
                Domestic
              </option>

              <option value="INTERNATIONAL">
                International
              </option>

            </select>

          </FormField>


          <FormField
            label="Payment Currency"
            error={batchErrors.currency}
            touched={true}
          >

            <select
              className={styles.input}
              value={batchData.currency}

              onChange={(event) =>
                handleBatchChange(
                  'currency',
                  event.target.value
                )
              }
            >

              <option value="INR">
                INR — Indian Rupee
              </option>

              <option value="USD">
                USD — US Dollar
              </option>

              <option value="EUR">
                EUR — Euro
              </option>

              <option value="GBP">
                GBP — Pound Sterling
              </option>

            </select>

          </FormField>

        </div>


        <div className={styles.row}>

          <FormField
            label="Debit Account"
            error={batchErrors.debitAccount}
            touched={true}
          >

            <select
              className={styles.input}

              value={batchData.debitAccount}

              onChange={(event) =>
                handleBatchChange(
                  'debitAccount',
                  event.target.value
                )
              }

              disabled={accountsLoading}
            >

              <option value="">
                {accountsLoading
                  ? 'Loading accounts...'
                  : 'Select debit account'}
              </option>


              {accounts.map((account) => (

                <option
                  key={account.id}
                  value={account.id}
                >

                  {account.label}

                </option>

              ))}

            </select>

          </FormField>


          <FormField
            label="Date"
            error={batchErrors.date}
            touched={true}
          >

            <input
              type="date"
              className={styles.input}

              value={batchData.date}

              onChange={(event) =>
                handleBatchChange(
                  'date',
                  event.target.value
                )
              }
            />

          </FormField>

        </div>


        <div className={styles.row}>

          <FormField
            label="Department"
            error={batchErrors.department}
            touched={true}
          >

            <select
              className={styles.input}

              value={batchData.department}

              onChange={(event) =>
                handleBatchChange(
                  'department',
                  event.target.value
                )
              }
            >

              <option value="">
                Select department
              </option>

              <option value="IT">
                IT
              </option>

              <option value="HR">
                HR
              </option>

              <option value="FINANCE">
                Finance
              </option>

              <option value="OPERATIONS">
                Operations
              </option>

              <option value="PAYROLL">
                Payroll
              </option>

            </select>

          </FormField>


          <FormField
            label="Cost Center"
            error={batchErrors.costCenter}
            touched={true}
          >

            <input
              className={styles.input}

              placeholder="e.g. CC1001"

              value={batchData.costCenter}

              onChange={(event) =>
                handleBatchChange(
                  'costCenter',
                  event.target.value.toUpperCase()
                )
              }
            />

          </FormField>

        </div>

      </section>


      {/* =========================
          PAYMENT DETAILS
      ========================== */}

      <section className={styles.section}>

        <div className={styles.sectionHeading}>

          <div>

            <h2 className={styles.sectionTitle}>
              Payment Details
            </h2>

            <p className={styles.sectionHint}>
              Add multiple payments to this batch.
            </p>

          </div>


          <button
            type="button"
            className={styles.addButton}
            onClick={addPayment}
          >

            + Add Payment

          </button>

        </div>


        {batchErrors.transactions && (

          <p className={styles.submitError}>
            {batchErrors.transactions}
          </p>

        )}


        {/* Header */}

        <div className={styles.paymentHeader}>

          <span>#</span>

          <span>Method</span>

          <span>Payee Name</span>

          <span>Payee Account</span>

          <span>IFSC</span>

          <span>Reference</span>

          <span>Amount</span>

          <span>Notes</span>

          <span />

        </div>


        {/* Payment rows */}

        {batchData.transactions.map(
          (row, index) => (

            <PaymentRow

              key={row.id}

              row={row}

              index={index}

              errors={
                rowErrors[index] || {}
              }

              onChange={(
                name,
                value
              ) =>
                handleRowChange(
                  index,
                  name,
                  value
                )
              }

              onRemove={() =>
                removePayment(index)
              }

              canRemove={
                batchData.transactions
                  .length > 1
              }

            />

          )
        )}


        {/* =========================
            BATCH TOTAL
        ========================== */}

        <div className={styles.totalBar}>

          <span>

            {batchData.transactions.length}{' '}

            {batchData.transactions.length === 1
              ? 'payment'
              : 'payments'}

          </span>


          <strong>

            Total Amount:{' '}

            {formatCurrency(
              totalAmount,
              batchData.currency
            )}

          </strong>

        </div>


        {batchErrors.total && (

          <p className={styles.submitError}>
            {batchErrors.total}
          </p>

        )}

      </section>


      {/* =========================
          ACCOUNT INFORMATION
      ========================== */}

      {selectedAccount && (

        <div className={styles.accountInfo}>

          Available Balance:{' '}

          <strong>

            {formatCurrency(
              selectedAccount.balance,
              selectedAccount.currency
            )}

          </strong>


          <span>

            Currency: {selectedAccount.currency}

          </span>

        </div>

      )}


      {/* =========================
          ERRORS
      ========================== */}

      {submitError && (

        <p
          className={styles.submitError}
          role="alert"
        >

          {submitError}

        </p>

      )}


      {/* =========================
          FOOTER
      ========================== */}

      <div className={styles.footerBar}>

        <span
          className={styles.saveStatus}
          aria-live="polite"
        >

          {saveState === 'saving' &&
            'Saving draft...'}

          {saveState === 'saved' &&
            'Draft saved ✓'}

          {saveState === 'error' &&
            'Draft could not be saved'}

        </span>


        <div className={styles.actions}>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={resetForm}
          >

            Cancel

          </button>


          <button
            type="submit"
            className={styles.primaryButton}
            disabled={
              submitting ||
              accountsLoading
            }
          >

            {submitting
              ? 'Submitting Batch...'
              : 'Submit Batch'}

          </button>

        </div>

      </div>

    </form>

  );

}