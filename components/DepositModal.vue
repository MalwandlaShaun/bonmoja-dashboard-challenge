<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden" @click.stop>
      <!-- Modal header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Deposit Funds</h3>
      </div>

      <!-- Modal content -->
      <div class="px-6 py-4">
        <div v-if="step === 'form'">
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (ZAR)</label>
            <input
                type="number"
                id="amount"
                v-model="amount"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter amount"
                min="10"
            />
            <div v-if="amountError" class="text-danger text-sm mt-1">{{ amountError }}</div>
          </div>

          <div class="mb-4">
            <label for="method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <div class="relative">
              <select
                  id="method"
                  v-model="paymentMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>Select payment method</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div v-if="methodError" class="text-danger text-sm mt-1">{{ methodError }}</div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else-if="step === 'loading'" class="py-8 flex flex-col items-center">
          <svg class="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div class="text-gray-700">Processing your deposit...</div>
        </div>

        <!-- Success state -->
        <div v-else-if="step === 'success'" class="py-8 flex flex-col items-center">
          <div class="bg-green-100 rounded-full p-3 mb-4">
            <svg class="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-xl font-medium text-gray-900 mb-1">Deposit Successful!</h4>
          <p class="text-gray-600 text-center mb-4">
            Your deposit of {{ formatCurrency(amount, 'ZAR') }} ZAR has been completed.
          </p>
        </div>

        <!-- Error state -->
        <div v-else-if="step === 'error'" class="py-8 flex flex-col items-center">
          <div class="bg-red-100 rounded-full p-3 mb-4">
            <svg class="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h4 class="text-xl font-medium text-gray-900 mb-1">Deposit Failed</h4>
          <p class="text-gray-600 text-center mb-4">
            There was a problem processing your payment. Please try again.
          </p>
        </div>
      </div>

      <!-- Modal footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
            v-if="step === 'form'"
            @click="closeModal"
            class="btn text-gray-700 bg-gray-200 hover:bg-gray-300 mr-2"
        >
          Cancel
        </button>
        <button
            v-if="step === 'form'"
            @click="submitDeposit"
            class="btn-primary"
        >
          Deposit
        </button>
        <button
            v-if="step === 'success' || step === 'error'"
            @click="closeModal"
            class="btn-primary"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'deposit-success']);

// State management
const amount = ref('');
const amountError = ref('');
const paymentMethod = ref('');
const methodError = ref('');
const step = ref('form');

// Format currency
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency || 'ZAR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2
  }).format(amount).replace(currency, '');
};

// Validate form
const validateForm = () => {
  let isValid = true;

  // Validate amount
  if (!amount.value || amount.value <= 0) {
    amountError.value = 'Please enter a valid amount';
    isValid = false;
  } else if (amount.value < 10) {
    amountError.value = 'Minimum deposit amount is 10 ZAR';
    isValid = false;
  } else {
    amountError.value = '';
  }

  // Validate payment method
  if (!paymentMethod.value) {
    methodError.value = 'Please select a payment method';
    isValid = false;
  } else {
    methodError.value = '';
  }

  return isValid;
};

// Submit the deposit
const submitDeposit = () => {
  if (!validateForm()) return;

  step.value = 'loading';

  // Simulate API call
  setTimeout(() => {
    // 90% chance of success for demo
    if (Math.random() < 0.9) {
      step.value = 'success';
      emit('deposit-success', {
        amount: parseFloat(amount.value),
        method: paymentMethod.value,
        date: new Date().toISOString()
      });
    } else {
      step.value = 'error';
    }
  }, 1000);
};

// Close the modal
const closeModal = () => {
  emit('close');
};

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    amount.value = '';
    paymentMethod.value = '';
    amountError.value = '';
    methodError.value = '';
    step.value = 'form';
  }
});
</script>