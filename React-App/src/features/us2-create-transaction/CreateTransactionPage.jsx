import TransactionForm from './components/TransactionForm';
import styles from './styles/TransactionForm.module.css';

export default function CreateTransactionPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Create transaction</h1>
        <p className={styles.pageSubtitle}>
          Enter the payment details below. Your entry is validated before it moves to approval.
        </p>
      </header>
      <TransactionForm />
    </div>
  );
}
