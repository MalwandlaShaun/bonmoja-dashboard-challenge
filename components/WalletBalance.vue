<template>
  <div class="card">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-gray-700">Wallet Balance</h2>
      <span v-if="isLoading" class="text-sm text-gray-500">Loading...</span>
    </div>
    <div v-if="error" class="text-danger text-center py-2">
      Failed to load wallet data. Please try again.
    </div>
    <div v-else-if="wallet" class="flex items-end">
      <span class="text-3xl font-bold">{{ formatCurrency(wallet.balance, wallet.currency) }}</span>
      <span class="text-gray-500 ml-2 mb-1">{{ wallet.currency }}</span>
    </div>
  </div>
</template>

<script setup>
const wallet = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Fetch wallet data
const fetchWallet = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await fetch('/api/wallet.json');
    if (!response.ok) throw new Error('Failed to fetch wallet data');
    wallet.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching wallet:', err);
  } finally {
    isLoading.value = false;
  }
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

// Fetch wallet on component mount
onMounted(() => {
  fetchWallet();
});
</script>