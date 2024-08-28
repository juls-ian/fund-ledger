export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  // stores the result of the fetchTransactions
  const transactions = ref([]);
  const pending = ref(false);

  // TRANSACTION TOTAL
  const income = computed(() =>
    //  t = transaction
    transactions.value.filter((transac) => transac.type === "Income")
  );

  const expense = computed(() => transactions.value.filter((transac) => transac.type === "Expense"));

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  const incomeTotal = computed(() =>
    //                   accumulator,  currentElement                    default value
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const expenseTotal = computed(() =>
    //                   accumulator,  currentElement                    default value
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  // FETCHING TRANSACTION & AUTO REFRESH PAGE UPON DELETE
  const fetchTransactions = async () => {
    pending.value = true;
    try {
      //                          transaction key must be unique
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          // data returns data from the table
          const { data, error } = await supabase
            .from("transactions")
            .select()
            // column >= (passed period)
            .gte("created_at", period.value.from.toISOString())
            // column <= (passed period)
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });
          if (error) return [];
          return data;
        }
      );
      // the useAsyncData data
      return data.value;
    } finally {
      pending.value = false;
    }
  };

  // fetches the result of fetchTransactions and puts to transactions ref value
  const refreshTransactions = async () => {
    transactions.value = await fetchTransactions();
  };

  // watcher to get different period
  watch(period, async () => await refreshTransactions());

  // ---------------------------
  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      //getting the date and formatting
      const date = new Date(transaction.created_at).toLocaleDateString().split("T")[0];
      //checking if grouped obj has the date property
      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    return grouped;
  });

  //   RETURN OBJECT
  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    },
    refreshTransactions,
    pending
  };
};
