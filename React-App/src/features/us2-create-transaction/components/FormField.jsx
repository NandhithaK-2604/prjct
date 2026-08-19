import styles from '../styles/TransactionForm.module.css';

export default function FormField({ label, error, touched, hint, children, htmlFor }) {
  const showError = touched && error;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !showError && <p className={styles.hint}>{hint}</p>}
      {showError && (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
