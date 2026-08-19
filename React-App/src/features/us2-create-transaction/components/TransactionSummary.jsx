import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

import styles from '../styles/TransactionForm.module.css';


export default function TransactionSummary({
  result,
  onCreateAnother,
}) {

  return (

    <div className={styles.summaryCard}>

      <div className={styles.summaryIcon}>
        ✓
      </div>


      <h2 className={styles.summaryTitle}>
        Batch submitted
      </h2>


      <p className={styles.summarySubtitle}>

        Batch ID:{' '}

        <strong>
          {result.batchId}
        </strong>

      </p>


      <dl className={styles.summaryList}>

        <div className={styles.summaryRow}>

          <dt>Debit Account</dt>

          <dd>
            {result.debitAccountLabel}
          </dd>

        </div>


        <div className={styles.summaryRow}>

          <dt>Date</dt>

          <dd>
            {formatDate(result.date)}
          </dd>

        </div>


        <div className={styles.summaryRow}>

          <dt>Department</dt>

          <dd>
            {result.department}
          </dd>

        </div>


        <div className={styles.summaryRow}>

          <dt>Cost Center</dt>

          <dd>
            {result.costCenter}
          </dd>

        </div>


        <div className={styles.summaryRow}>

          <dt>Payment Count</dt>

          <dd>
            {result.transactionCount}
          </dd>

        </div>


        <div className={styles.summaryRow}>

          <dt>Total Amount</dt>

          <dd className={styles.summaryAmount}>

            {formatCurrency(
              result.totalAmount,
              result.currency
            )}

          </dd>

        </div>

      </dl>


      <p className={styles.pendingNote}>

        Status: pending approval.
        The batch will move to the approval workflow next.

      </p>


      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onCreateAnother}
      >

        Create another batch

      </button>

    </div>

  );

}