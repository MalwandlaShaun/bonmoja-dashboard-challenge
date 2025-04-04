<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with click-outside to close -->
    <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal content -->
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full m-4 p-6 z-10 transform transition-all">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Withdraw Funds</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Step -->
      <div v-if="step === 'form'">
        <div class="space-y-4">
          <!-- Amount input -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (ZAR)</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">R</span>
              </div>
              <input
                  id="amount"
                  type="number"
                  v-model="amount"
                  min="10"
                  class="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0.00"
              />
            </div>
            <p v-if="amountError" class="mt-1 text-sm text-red-600">{{ amountError }}</p>
            <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum withdrawal: R10.00</p>
          </div>

          <!-- Withdrawal method -->
          <div>
            <label for="withdrawMethod" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal Method</label>
            <select
                id="withdrawMethod"
                v-model="withdrawMethod"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>Select a withdrawal method</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="e_wallet">E-Wallet</option>
            </select>
            <p v-if="methodError" class="mt-1 text-sm text-red-600">{{ methodError }}</p>
          </div>

          <!-- Account details based on selected method -->
          <div v-if="withdrawMethod">
            <div v-if="withdrawMethod === 'bank_transfer'">
              <label for="accountNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Account Number</label>
              <input
                  id="accountNumber"
                  type="text"
                  v-model="accountDetails.accountNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="accountError" class="mt-1 text-sm text-red-600">{{ accountError }}</p>
            </div>
            <div v-else-if="withdrawMethod === 'mobile_money'">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <input
                  id="phoneNumber"
                  type="tel"
                  v-model="accountDetails.phoneNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="accountError" class="mt-1 text-sm text-red-600">{{ accountError }}</p>
            </div>
            <div v-else-if="withdrawMethod === 'e_wallet'">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Wallet Email</label>
              <input
                  id="email"
                  type="email"
                  v-model="accountDetails.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="accountError" class="mt-1 text-sm text-red-600">{{ accountError }}</p>
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="mt-6">
          <button
              @click="submitWithdrawal"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Withdraw Funds
          </button>
        </div>
      </div>

      <!-- Loading Step -->
      <div v-else-if="step === 'loading'" class="py-8 flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Processing your withdrawal...</p>
      </div>

      <!-- Success Step -->
      <div v-else-if="step === 'success'" class="py-8 flex flex-col items-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Withdrawal Successful!</h3>
        <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
          You have successfully withdrawn {{ formatCurrency(parseFloat(amount), 'ZAR') }} ZAR.
        </p>
        <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>

      <!-- Error Step -->
      <div v-else-if="step === 'error'" class="py-8 flex flex-col items-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Withdrawal Failed</h3>
        <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
          There was an issue processing your withdrawal. Please try again.
        </p>
        <div class="flex space-x-3">
          <button
              @click="step = 'form'"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
          <button
              @click="closeModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  walletBalance: {
    type: Number,
    default: 0 ? 0 : 7250.50,
  },
  currency: {
    type: String,
    default: 'ZAR'
  }
});

const emit = defineEmits(['close', 'withdrawal-success']);

// State management
const amount = ref('');
const amountError = ref('');
const withdrawMethod = ref('');
const methodError = ref('');
const accountDetails = ref({
  accountNumber: '',
  phoneNumber: '',
  email: ''
});
const accountError = ref('');
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
  if (!amount.value || parseFloat(amount.value) <= 0) {
    amountError.value = 'Please enter a valid amount';
    isValid = false;
  } else if (parseFloat(amount.value) < 10) {
    amountError.value = 'Minimum withdrawal amount is 10 ZAR';
    isValid = false;
  } else if (parseFloat(amount.value) > props.walletBalance) {
    amountError.value = `You can't withdraw more than your balance (${formatCurrency(props.walletBalance, props.currency)} ${props.currency})`;
    isValid = false;
  } else {
    amountError.value = '';
  }

  // Validate payment method
  if (!withdrawMethod.value) {
    methodError.value = 'Please select a withdrawal method';
    isValid = false;
  } else {
    methodError.value = '';
  }

  // Validate account details
  if (withdrawMethod.value === 'bank_transfer' && !accountDetails.value.accountNumber) {
    accountError.value = 'Please enter your bank account number';
    isValid = false;
  } else if (withdrawMethod.value === 'mobile_money' && !accountDetails.value.phoneNumber) {
    accountError.value = 'Please enter your mobile number';
    isValid = false;
  } else if (withdrawMethod.value === 'e_wallet' && !accountDetails.value.email) {
    accountError.value = 'Please enter your e-wallet email';
    isValid = false;
  } else {
    accountError.value = '';
  }

  return isValid;
};

// Submit the withdrawal
const submitWithdrawal = () => {
  if (!validateForm()) return;

  step.value = 'loading';

  // Simulate API call
  setTimeout(() => {
    // 80% chance of success for demo
    if (Math.random() < 0.8) {
      step.value = 'success';
      emit('withdrawal-success', {
        amount: parseFloat(amount.value),
        method: withdrawMethod.value,
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
    withdrawMethod.value = '';
    accountDetails.value = {
      accountNumber: '',
      phoneNumber: '',
      email: ''
    };
    amountError.value = '';
    methodError.value = '';
    accountError.value = '';
    step.value = 'form';
  }
});
</script>