// Mock data + mock API calls

const MOCK_ACCOUNTS = [
  {
    id: 'acc-1',
    label: 'Operations – 0012345678',
    balance: 458200.5,
    currency: 'INR',
  },
  {
    id: 'acc-2',
    label: 'Payroll – 0098765432',
    balance: 1250000,
    currency: 'INR',
  },
  {
    id: 'acc-3',
    label: 'Marketing – 0055667788',
    balance: 76300,
    currency: 'INR',
  },
];

const ARTIFICIAL_DELAY_MS = 600;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDebitAccounts() {
  await delay(ARTIFICIAL_DELAY_MS);
  return MOCK_ACCOUNTS;
}


// ------------------------------
// AUTO SAVE BATCH AS DRAFT
// ------------------------------

export async function saveBatchDraft(batch) {
  await delay(300);

  const draft = {
    ...batch,
    status: 'DRAFT',
    savedAt: new Date().toISOString(),
  };

  // For now we use localStorage as mock persistence.
  // Later this can be replaced with a backend API.
  localStorage.setItem('us2-batch-draft', JSON.stringify(draft));

  return draft;
}


// ------------------------------
// GET EXISTING DRAFT
// ------------------------------

export async function getBatchDraft() {
  const savedDraft = localStorage.getItem('us2-batch-draft');

  if (!savedDraft) {
    return null;
  }

  try {
    return JSON.parse(savedDraft);
  } catch {
    return null;
  }
}


// ------------------------------
// SUBMIT BATCH
// ------------------------------

export async function submitBatch(batch) {
  await delay(ARTIFICIAL_DELAY_MS);

  if (Math.random() < 0.05) {
    throw new Error(
      'Batch could not be submitted. Please try again.'
    );
  }

  // Draft is no longer needed after successful submission.
  localStorage.removeItem('us2-batch-draft');

  return {
    batchId: `BATCH-${Date.now()}`,
    status: 'pending approval',
    submittedAt: new Date().toISOString(),
    ...batch,
  };
}