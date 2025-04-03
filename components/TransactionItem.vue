<template>
  <div class="border-b border-gray-200 py-3 px-1 flex justify-between items-center">
    <div class="flex flex-col">
      <div class="flex items-center">
        <span v-if="transaction.type === 'deposit'" class="text-secondary mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 17a1 1 0 0 0 1-1V4.414l3.293 3.293a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 1 0 1.414 1.414L9 4.414V16a1 1 0 0 0 1 1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else class="text-danger mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 0 0-1 1v11.586l-3.293-3.293a1 1 0 1 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0-1.414-1.414L11 15.586V4a1 1 0 0 0-1-1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="capitalize font-medium">{{ transaction.type }}</span>
      </div>
      <span class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</span>
    </div>
    <div class="text-right">
      <div :class="[
        'font-semibold',
        transaction.type === 'deposit' ? 'text-secondary' : 'text-danger'
      ]">
        {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(transaction.amount, transaction.currency) }}
      </div>
      <span :class="[
        'text-xs px-2 py-1 rounded-full capitalize',
        transaction.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ transaction.status }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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
</script>