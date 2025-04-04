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

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
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
                  step="10"
                  required
                  class="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0.00"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum withdrawal: R10.00</p>
          </div>

          <!-- Withdrawal method -->
          <div>
            <label for="method" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal Method</label>
            <select
                id="method"
                v-model="selectedMethod"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
            >
              <option value="" disabled>Select a withdrawal method</option>
              <option v-for="method in withdrawalMethods" :key="method.id" :value="method.id">
                {{ method.name }}
              </option>
            </select>
          </div>

          <!-- Account details based on selected method -->
          <div v-if="selectedMethod">
            <div v-if="selectedMethod === 'bank_transfer'">
              <label for="accountNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Account Number</label>
              <input
                  id="accountNumber"
                  type="text"
                  v-model="accountDetails.accountNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
              />
            </div>
            <div v-else-if="selectedMethod === 'mobile_money'">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <input
                  id="phoneNumber"
                  type="tel"
                  v-model="accountDetails.phoneNumber"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
              />
            </div>
            <div v-else-if="selectedMethod === 'e_wallet'">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Wallet Email</label>
              <input
                  id="email"
                  type="email"
                  v-model="accountDetails.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
              />
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="mt-6">
          <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Processing...' : 'Withdraw Funds' }}
          </button>
        </div>
      </form>

      <!-- Success/Error message -->
      <div v-if="submissionState" class="mt-4 text-center p-4 rounded-md" :class="{
        'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400': submissionState === 'success',
        'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400': submissionState === 'error'
      }">
        <p v-if="submissionState === 'success'">
          Withdrawal request submitted successfully! Your funds will be processed shortly.
        </p>
        <p v-else-if="submissionState === 'error'">
          Error processing withdrawal. Please check your details and try again.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WithdrawModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    walletBalance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'ZAR'
    }
  },
  data() {
    return {
      amount: '',
      selectedMethod: '',
      accountDetails: {
        accountNumber: '',
        phoneNumber: '',
        email: ''
      },
      isSubmitting: false,
      submissionState: null, // null, 'success', or 'error'
      withdrawalMethods: [
        { id: 'bank_transfer', name: 'Bank Transfer' },
        { id: 'mobile_money', name: 'Mobile Money' },
        { id: 'e_wallet', name: 'E-Wallet' }
      ]
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    resetForm() {
      this.amount = '';
      this.selectedMethod = '';
      this.accountDetails = {
        accountNumber: '',
        phoneNumber: '',
        email: ''
      };
      this.isSubmitting = false;
      this.submissionState = null;
    },
    handleSubmit() {
      // Validate amount against wallet balance
      if (parseFloat(this.amount) > this.walletBalance) {
        this.submissionState = 'error';
        return;
      }

      this.isSubmitting = true;
      this.submissionState = null;

      // Simulate API call with setTimeout
      setTimeout(() => {
        // Randomly succeed or fail for demo purposes (80% success rate)
        const isSuccess = Math.random() < 0.8;

        this.isSubmitting = false;
        this.submissionState = isSuccess ? 'success' : 'error';

        // If successful, emit event to update wallet balance
        if (isSuccess) {
          this.$emit('withdrawal-success', {
            amount: parseFloat(this.amount),
            method: this.selectedMethod,
            timestamp: new Date().toISOString()
          });

          // Automatically close after success (optional)
          setTimeout(() => {
            if (this.submissionState === 'success') {
              this.closeModal();
            }
          }, 3000);
        }
      }, 1500);
    }
  }
}
</script>