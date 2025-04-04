<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with logo and user profile -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo placeholder - replace with actual logo -->
            <div class="flex-shrink-0 flex items-center">
              <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span class="text-white font-bold">B</span>
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">Bonmoja</span>
            </div>
          </div>

          <!-- User profile -->
          <div class="flex items-center">
            <div class="relative ml-3">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-700 hidden md:block">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <!-- Wallet Balance Card -->
        <div class="md:col-span-8">
          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-700">Wallet Balance</h2>
                <span v-if="isWalletLoading" class="text-sm text-gray-500">Loading...</span>
              </div>

              <div v-if="walletError" class="text-red-600 text-center py-2">
                Failed to load wallet data. Please try again.
              </div>

              <div v-else-if="wallet" class="flex flex-col">
                <div class="flex items-baseline">
                  <span class="text-4xl font-bold text-gray-900">{{ formatCurrency(wallet.balance, wallet.currency) }}</span>
                  <span class="text-gray-500 ml-2 text-xl">{{ wallet.currency }}</span>
                </div>
                <div class="mt-1 text-sm text-gray-500">Updated just now</div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-6">
                <button @click="openDepositModal" class="inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Deposit Funds
                </button>
                <button @click="openWithdrawalModal"  class="inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 17a1 1 0 01-1-1V6.414l-3.293 3.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 01-1 1z" clip-rule="evenodd" />
                  </svg>
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div class="md:col-span-4">
          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h2>

              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Last deposit</span>
                  <span class="text-gray-900 font-medium">R2,000.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Last withdrawal</span>
                  <span class="text-gray-900 font-medium">R500.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total transactions</span>
                  <span class="text-gray-900 font-medium">{{ transactions.length || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Card -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div class="p-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-700 mb-2 md:mb-0">Transaction History</h2>

            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <!-- Search transactions -->
              <div class="relative">
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search transactions"
                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <!-- Filter transactions -->
              <div class="relative">
                <select
                    v-model="filter"
                    class="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full md:w-auto"
                >
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits Only</option>
                  <option value="withdrawal">Withdrawals Only</option>
                  <option value="success">Successful Only</option>
                  <option value="failed">Failed Only</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="isTransactionsLoading" class="py-12 flex justify-center">
            <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <!-- Error state -->
          <div v-else-if="transactionsError" class="py-12 text-center">
            <div class="text-red-600 font-medium mb-2">Failed to load transactions</div>
            <button @click="fetchTransactions" class="text-blue-600 underline">Retry</button>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredTransactions.length === 0" class="py-12 text-center">
            <div class="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ filter !== 'all' ? 'Try changing your filter or search term.' : 'Start by making a deposit to your wallet.' }}
            </p>
            <div class="mt-6" v-if="filter !== 'all' || searchQuery">
              <button
                  @click="resetFilters"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset filters
              </button>
            </div>
          </div>

          <!-- Transactions table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center" v-if="transaction.type === 'deposit'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center" v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 capitalize">
                        {{ transaction.type }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ transaction.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(transaction.date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(transaction.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold" :class="transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount, transaction.currency) }}
                  </div>
                  <div class="text-sm text-gray-500">{{ transaction.currency }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      transaction.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ transaction.status }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4" v-if="filteredTransactions.length > 0">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredTransactions.length }}</span> of <span class="font-medium">{{ filteredTransactions.length }}</span> results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </a>
                  <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Deposit Modal -->
    <deposit-modal
        :is-open="isDepositModalOpen"
        @close="closeDepositModal"
        @deposit-success="handleDepositSuccess"
    />

  <!-- Withdrawal Modal -->
    <withdraw-modal
        :is-open="isWithdrawalModalOpen"
        @close="closeWithdrawalModal"
        @deposit-success="handleWithdrawalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DepositModal from '~/components/DepositModal.vue';
import WithdrawModal from "~/components/WithdrawModal.vue";
// State management
const wallet = ref(null);
const isWalletLoading = ref(true);
const walletError = ref(null);

const transactions = ref([]);
const isTransactionsLoading = ref(true);
const transactionsError = ref(null);

// Filter and search
const filter = ref('all');
const searchQuery = ref('');

// Modal state
const isDepositModalOpen = ref(false);
const isWithdrawalModalOpen = ref(false);


// Computed property for filtered and searched transactions
const filteredTransactions = computed(() => {
  let results = transactions.value;

  // Apply type filter
  if (filter.value === 'deposit') {
    results = results.filter(t => t.type === 'deposit');
  } else if (filter.value === 'withdrawal') {
    results = results.filter(t => t.type === 'withdrawal');
  } else if (filter.value === 'success') {
    results = results.filter(t => t.status === 'success');
  } else if (filter.value === 'failed') {
    results = results.filter(t => t.status === 'failed');
  }

  // Apply search filter if search query exists
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(t =>
        t.id.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
    );
  }

  return results;
});

// Reset filters
const resetFilters = () => {
  filter.value = 'all';
  searchQuery.value = '';
};

// Fetch wallet data
const fetchWallet = async () => {
  try {
    isWalletLoading.value = true;
    walletError.value = null;
    const response = await fetch('/api/wallet.json');
    if (!response.ok) throw new Error('Failed to fetch wallet data');
    wallet.value = await response.json();
  } catch (err) {
    walletError.value = err.message;
    console.error('Error fetching wallet:', err);
  } finally {
    isWalletLoading.value = false;
  }
};

// Fetch transactions
const fetchTransactions = async () => {
  try {
    isTransactionsLoading.value = true;
    transactionsError.value = null;
    const response = await fetch('/api/transactions.json');
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();

    // Sort transactions by date (newest first)
    transactions.value = data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  } catch (err) {
    transactionsError.value = err.message;
    console.error('Error fetching transactions:', err);
  } finally {
    isTransactionsLoading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format currency
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency || 'ZAR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2
  }).format(amount).replace(currency, '');
};

// Modal handlers
const openDepositModal = () => {
  isDepositModalOpen.value = true;
};

const closeDepositModal = () => {
  isDepositModalOpen.value = false;
};

const openWithdrawalModal = () => {
  isWithdrawalModalOpen.value = true;
};

const closeWithdrawalModal = () => {
  isWithdrawalModalOpen.value = false;
};



// Handle successful deposit
const handleDepositSuccess = (depositData) => {
  // In a real app, you would refresh wallet data after deposit
  console.log('Deposit successful:', depositData);

  // Simulate a wallet balance update
  if (wallet.value) {
    wallet.value.balance += parseFloat(depositData.amount);
  }

  // Add a new transaction to the list
  const newTransaction = {
    id: `txn_${Date.now().toString().slice(-6)}`,
    type: 'deposit',
    amount: parseFloat(depositData.amount),
    currency: 'ZAR',
    status: 'success',
    date: new Date().toISOString()
  };

  transactions.value = [newTransaction, ...transactions.value];

  // Close the modal after 2 seconds
  setTimeout(() => {
    closeDepositModal();
  }, 2000);
};

// Handle successful Withdrawal
const handleWithdrawalSuccess = (WithdrawalData) => {
  // In a real app, you would refresh wallet data after deposit
  console.log('Deposit successful:', WithdrawalData);

  // Simulate a wallet balance update
  if (wallet.value) {
    wallet.value.balance -= parseFloat(WithdrawalData.amount);
  }

  // Add a new transaction to the list
  const newTransaction = {
    id: `txn_${Date.now().toString().slice(-6)}`,
    type: 'deposit',
    amount: parseFloat(WithdrawalData.amount),
    currency: 'ZAR',
    status: 'success',
    date: new Date().toISOString()
  };

  transactions.value = [newTransaction, ...transactions.value];

  // Close the modal after 2 seconds
  setTimeout(() => {
    closeWithdrawalModal();
  }, 2000);
};

// Fetch data on component mount
onMounted(() => {
  fetchWallet();
  fetchTransactions();
});
</script>