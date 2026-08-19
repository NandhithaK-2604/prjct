import FormField from './FormField';
import styles from '../styles/TransactionForm.module.css';

export default function PaymentRow({
  row,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}) {
  return (
    <div className={styles.paymentRow}>

      <div className={styles.rowNumber}>
        {index + 1}
      </div>

      <FormField
        label="Payment method"
        error={errors?.paymentMethod}
        touched={true}
      >
        <select
          className={styles.input}
          value={row.paymentMethod}
          onChange={(e) =>
            onChange('paymentMethod', e.target.value)
          }
        >
          <option value="BANK">Bank</option>
          <option value="INTERNAL">Internal</option>
        </select>
      </FormField>


      <FormField
        label="Payee name"
        error={errors?.payeeName}
        touched={true}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Payee name"
          value={row.payeeName}
          onChange={(e) =>
            onChange('payeeName', e.target.value)
          }
        />
      </FormField>


      <FormField
        label="Payee account"
        error={errors?.payeeAccountNumber}
        touched={true}
      >
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="Account number"
          value={row.payeeAccountNumber}
          onChange={(e) =>
            onChange(
              'payeeAccountNumber',
              e.target.value.replace(/\D/g, '')
            )
          }
        />
      </FormField>


      <FormField
        label="IFSC"
        error={errors?.ifsc}
        touched={true}
      >
        <input
          className={styles.input}
          type="text"
          maxLength={11}
          placeholder="HDFC0001234"
          value={row.ifsc}
          onChange={(e) =>
            onChange(
              'ifsc',
              e.target.value.toUpperCase()
            )
          }
        />
      </FormField>


      <FormField
        label="Reference"
        error={errors?.reference}
        touched={true}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Optional"
          value={row.reference}
          onChange={(e) =>
            onChange('reference', e.target.value)
          }
        />
      </FormField>


      <FormField
        label="Amount"
        error={errors?.amount}
        touched={true}
      >
        <input
          className={styles.input}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={row.amount}
          onChange={(e) =>
            onChange('amount', e.target.value)
          }
        />
      </FormField>


      <FormField
        label="Notes"
        error={errors?.notes}
        touched={true}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Optional"
          value={row.notes}
          onChange={(e) =>
            onChange('notes', e.target.value)
          }
        />
      </FormField>


      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        disabled={!canRemove}
      >
        ×
      </button>

    </div>
  );
}