<template>
  <div>
    <!-- DETAILS-->
    <div class="font-bold" :class="[color]">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <!-- Skeleton component (spinner) -->
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>
    <!-- ICON -->
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <!-- UIcon -->
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{ green: trendHigh, red: !trendHigh }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageComparison }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  //props we will pass to index.vue
  const props = defineProps({
    title: String,
    currentAmount: Number,
    lastAmount: Number,
    color: String,
    loading: Boolean,
  });

  // converting prop to a ref
  const { currentAmount } = toRefs(props);

  // trend high or low indication
  const trendHigh = computed(() => {
    return currentAmount >= props.lastAmount;
  });

  const icon = computed(() => {
    return trendHigh.value
      ? "i-solar-course-up-bold"
      : "i-solar-course-down-bold";
  });

  const percentageComparison = computed(() => {
    if (props.currentAmount === 0 || props.lastAmount === 0) return "♾️%";

    const higherValue = Math.max(props.currentAmount, props.lastAmount);
    const lowerValue = Math.min(props.currentAmount, props.lastAmount);
    const ratio = ((higherValue - lowerValue) / lowerValue) * 100;
    //return round off
    return `${Math.ceil(ratio)}%`;
  });

  const { currency } = useCurrency(currentAmount);
</script>

<style scoped>
  .green {
    @apply text-green-600 dark:text-green-400;
  }

  .red {
    @apply text-red-600 dark:text-red-400;
  }

  .blue {
    @apply text-blue-600 dark:text-blue-400;
  }

  .yellow {
    @apply text-yellow-600 dark:text-yellow-400;
  }

  .indigo {
    @apply text-indigo-600 dark:text-indigo-400;
  }

  .cyan {
    @apply text-cyan-600 dark:text-cyan-400;
  }
  /* title colors */
</style>