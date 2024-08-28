<template>
  <div
    class="grid grid-cols-2 py-2 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <!-- LEFT side -->
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <!-- RIGHT side -->
    <div class="flex items-center justify-end mr-10">{{ currency }}</div>
  </div>
</template>

<script setup>
  const props = defineProps({
    //passed in the index.vue
    date: String,
    transactions: Object,
  });

  const transactionSum = computed(() => {
    let computation = 0;

    for (const transaction of props.transactions) {
      if (transaction.type === "Income") {
        computation += transaction.amount;
      } else {
        computation -= transaction.amount;
      }
    }
    return computation;
  });
  const { currency } = useCurrency(transactionSum);
</script>