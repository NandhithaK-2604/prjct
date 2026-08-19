import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  getDebitAccounts,
  saveBatchDraft,
  getBatchDraft,
  submitBatch,
} from '../services/transactionService';

import { validateBatch } from '../validation/transactionValidation';

import { todayForInput } from '../utils/formatDate';


function createPayment() {
  return {
    id: crypto.randomUUID(),
    paymentMethod: 'BANK',
    payeeName: '',
    payeeAccountNumber: '',
    ifsc: '',
    reference: '',
    amount: '',
    notes: '',
  };
}


const initialBatch = {
  paymentType: 'DOMESTIC',
  currency: 'INR',
  debitAccount: '',
  date: todayForInput(),
  department: '',
  costCenter: '',
  transactions: [createPayment()],
};


export function useTransactionForm() {

  const [accounts, setAccounts] = useState([]);

  const [accountsLoading, setAccountsLoading] =
    useState(true);

  const [batchData, setBatchData] =
    useState(initialBatch);

  const [batchErrors, setBatchErrors] =
    useState({});

  const [rowErrors, setRowErrors] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState('');

  const [result, setResult] =
    useState(null);

  const [saveState, setSaveState] =
    useState('idle');


  // ----------------------------------
  // Load accounts
  // ----------------------------------

  useEffect(() => {

    let mounted = true;

    getDebitAccounts().then((list) => {

      if (!mounted) return;

      setAccounts(list);

      setAccountsLoading(false);

    });

    return () => {
      mounted = false;
    };

  }, []);


  // ----------------------------------
  // Load existing draft
  // ----------------------------------

  useEffect(() => {

    getBatchDraft().then((draft) => {

      if (draft) {
        setBatchData(draft);
      }

    });

  }, []);


  // ----------------------------------
  // Selected debit account
  // ----------------------------------

  const selectedAccount =
    accounts.find(
      (account) =>
        account.id === batchData.debitAccount
    ) || null;


  // ----------------------------------
  // Auto-save draft
  // ----------------------------------

  useEffect(() => {

    // Don't auto-save before accounts are loaded.
    if (accountsLoading) return;

    // Don't save completely empty data.
    const hasData =
      batchData.debitAccount ||
      batchData.department ||
      batchData.costCenter ||
      batchData.transactions.some(
        (row) =>
          row.payeeName ||
          row.payeeAccountNumber ||
          row.ifsc ||
          row.amount
      );

    if (!hasData) return;


    setSaveState('saving');


    const timer = setTimeout(async () => {

      try {

        await saveBatchDraft(batchData);

        setSaveState('saved');

      } catch (error) {

        console.error(error);

        setSaveState('error');

      }

    }, 1000);


    return () => clearTimeout(timer);

  }, [batchData, accountsLoading]);


  // ----------------------------------
  // Change batch-level field
  // ----------------------------------

  const handleBatchChange =
    useCallback((name, value) => {

      setBatchData((prev) => ({
        ...prev,
        [name]: value,
      }));

    }, []);


  // ----------------------------------
  // Change payment row
  // ----------------------------------

  const handleRowChange =
    useCallback(
      (index, name, value) => {

        setBatchData((prev) => {

          const transactions =
            [...prev.transactions];

          transactions[index] = {
            ...transactions[index],
            [name]: value,
          };

          return {
            ...prev,
            transactions,
          };

        });

      },
      []
    );


  // ----------------------------------
  // Add payment
  // ----------------------------------

  const addPayment = () => {

    setBatchData((prev) => ({
      ...prev,

      transactions: [
        ...prev.transactions,
        createPayment(),
      ],

    }));

  };


  // ----------------------------------
  // Remove payment
  // ----------------------------------

  const removePayment = (index) => {

    setBatchData((prev) => ({

      ...prev,

      transactions:
        prev.transactions.filter(
          (_, i) => i !== index
        ),

    }));

  };


  // ----------------------------------
  // Validate row on blur
  // ----------------------------------

  const handleRowBlur = () => {
    // Full validation happens on Submit.
    // This can be extended for field-level validation.
  };


  // ----------------------------------
  // Submit batch
  // ----------------------------------

  const handleSubmit = async () => {

    setSubmitError('');

    const validation =
      validateBatch(
        batchData,
        selectedAccount
      );


    setBatchErrors(
      validation.batch || {}
    );

    setRowErrors(
      validation.rows || []
    );


    const hasErrors =
      Object.keys(validation.batch || {})
        .length > 0 ||
      (validation.rows &&
        validation.rows.some(
          (row) =>
            Object.keys(row).length > 0
        ));


    if (hasErrors) {
      return;
    }


    setSubmitting(true);


    try {

      const total =
        batchData.transactions.reduce(
          (sum, row) =>
            sum + (Number(row.amount) || 0),
          0
        );


      const response =
        await submitBatch({

          ...batchData,

          transactions:
            batchData.transactions.map(
              (row) => ({
                ...row,
                ifsc:
                  row.ifsc.toUpperCase(),
              })
            ),

          debitAccountLabel:
            selectedAccount?.label,

          totalAmount: total,

          transactionCount:
            batchData.transactions.length,

        });


      setResult(response);


    } catch (error) {

      setSubmitError(
        error.message ||
        'Batch submission failed.'
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ----------------------------------
  // Reset
  // ----------------------------------

  const resetForm = () => {

    localStorage.removeItem(
      'us2-batch-draft'
    );

    setBatchData({
      ...initialBatch,
      transactions: [createPayment()],
    });

    setBatchErrors({});
    setRowErrors([]);
    setSubmitError('');
    setResult(null);
    setSaveState('idle');

  };


  return {

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

  };

}