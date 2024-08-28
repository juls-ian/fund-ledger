# Alternative

const fetchTransactions = async () => {
  pending.value = true;
  try {
    // Perform the data fetching directly
    const { data, error } = await supabase
      .from("transactions")
      .select()
      .gte("created_at", period.value.from.toISOString())
      .lte("created_at", period.value.to.toISOString())
      .order("created_at", { ascending: false });

    // Handle any errors that may have occurred
    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    // Return the fetched data
    return data;
  } finally {
    pending.value = false;
  }
};
