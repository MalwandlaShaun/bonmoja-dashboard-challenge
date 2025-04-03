<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-700">Recent Transactions</h2>
      <div class="flex items-center" v-if="!isLoading && transactions.length > 0">
        <div class="relative">
          <select v-model="filter" class="text-sm border border-gray-300 rounded-md px-2 py-1 pr-8 appearance-none">
            <option value="all">All</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="py-8 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="py-8 text-center">
      <div class="text-danger font-medium mb-2">Failed to load transactions</div>
      <button @click="fetchTransactions" class="text-primary underline">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredTransactions.length === 0" class="py-8 text-center">
      <div class="text-gray-500">No transactions found</div>
      <div v-if="filter !== 'all'" class="text-sm text-gray-400 mt-1">
        Try changing your filter
      </div>
    </div>

    <!-- Transaction list -->
    <div v-else>
      <transaction-item
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          :transaction="transaction"
      />
    </div>
  </div>
</template>

<script setup>
import TransactionItem from './TransactionItem.vue';

const transactions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const filter = ref('all');

// Computed property for filtered transactions
const filteredTransactions = computed(() => {
  if (filter.value === 'all') return transactions.value;
  return transactions.value.filter(t => t.type === filter.value);
});

// Fetch transactions
const fetchTransactions = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await fetch('/api/transactions.json');
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();

    // Sort transactions by date (newest first)
    transactions.value = data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching transactions:', err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch transactions on component mount
onMounted(() => {
  fetchTransactions();
});
</script>