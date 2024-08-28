<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <!-- Nuxt Ui SelectMenu -->
      <USelect :options="transactionPeriodOptions" v-model="selectedPeriod" />
    </div>
  </section>

  <!-- TRENDS -->
  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="indigo"
      title="Income"
      :current-amount="incomeTotal"
      :last-amount="prevIncomeTotal"
      :loading="pending"
    />
    <Trend
      color="yellow"
      title="Expense"
      :current-amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="pending"
    />
    <Trend
      color="blue"
      title="Investments"
      :current-amount="6000"
      :last-amount="7000"
      :loading="pending"
    />
    <Trend
      color="cyan"
      title="Savings"
      :current-amount="9000"
      :last-amount="3000"
      :loading="pending"
    />
  </section>
  <!-- TRANSACTION TOTAL -->
  <section class="flex justify-between mb-10">
    <!-- left -->
    <div>
      <h3 class="text-1xl font-extrabold">Transactions Summary</h3>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} income and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <!-- right -->
    <div>
      <!-- ADDING TRANSACTION            saved emit-->
      <TransactionModal v-model="isOpen" @saved="refreshCurrent()" />
      <UButton
        icon="i-solar-add-circle-linear"
        color="emerald"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <!-- TRANSACTIONS -->
  <section v-if="!pending">
    <!-- iterating transactionsGroupedByDate -->
    <div v-for="(transactionsPerDay, date) in byDate" :key="date" class="mb-10">
      <!--                      prop date above -->
      <DailyTransactionSummary
        :date="date"
        :transactions="transactionsPerDay"
      />
      <Transaction
        v-for="transaction in transactionsPerDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshCurrent()"
        @edited="refreshCurrent()"
      />
      <!-- :prop = ref (we declared below)  -->
    </div>
  </section>
  <!-- loader when refresh takes place -->
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
  import { transactionPeriodOptions } from "~/utils/constants";

  // access current user
  const user = useSupabaseUser();
  const selectedPeriod = ref(
    user.value.user_metadata?.preferences ?? transactionPeriodOptions[1]
  );
  // for the modal two way data binding
  const isOpen = ref(false);

  // SELECTED PERIOD TOGGLE
  const { current, previous } = useSelectedTimePeriod(selectedPeriod);

  // FETCHING CURRENT PERIOD
  const {
    pending,
    refreshTransactions: refreshCurrent,
    transactions: {
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
      grouped: { byDate },
    },
    // passing the current date or period
  } = useFetchTransactions(current);
  // await refreshCurrent();

  // FETCHING PREVIOUS PERIOD
  const {
    refreshTransactions: refreshPrevious,
    transactions: {
      //            ALIAS
      incomeTotal: prevIncomeTotal,
      expenseTotal: prevExpenseTotal,
    },
  } = useFetchTransactions(previous);

  await Promise.all([refreshCurrent(), refreshPrevious()]);
</script>