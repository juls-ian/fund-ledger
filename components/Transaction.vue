<template>
  <div
    class="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <!-- LEFT side -->
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <!-- Badge component -->
        <UBadge color="sky" variant="outline" v-if="transaction.category">{{
          transaction.category
        }}</UBadge>
      </div>
    </div>
    <!-- RIGHT side -->
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="options" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="yellow"
            variant="ghost"
            trailing-icon="i-solar-menu-dots-bold"
            :loading="isLoading"
          />
          <TransactionModal
            v-model="isEditOpen"
            :transaction="transaction"
            @saved="emit('edited')"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    //passed in the index.vue
    transaction: Object, // contains all transaction in the database
  });
  // EDIT TRANSACTION MODAL
  const isEditOpen = ref(false);

  // CURRENCY
  const { currency } = useCurrency(props.transaction.amount);
  // TOAST NOTIFICATION
  const { toastSuccess, toastError } = useAppToast();

  // REFRESHING VIEW ~ EMIT EVENT
  //                  array of event names
  const emit = defineEmits(["deleted", "edited"]);

  const isIncome = computed(() => {
    return props.transaction.type === "Income";
  });
  const icon = computed(() => {
    return isIncome.value
      ? "i-solar-arrow-right-up-bold"
      : "i-solar-arrow-left-down-bold";
  });
  const iconColor = computed(() => {
    return isIncome.value ? "text-green-600" : "text-red-600";
  });

  // DELETING TRANSACTION
  const supabase = useSupabaseClient();
  const isLoading = ref(false);
  const deleteTransaction = async () => {
    isLoading.value = true;
    try {
      //                    table name
      await supabase.from("transactions").delete().eq("id", props.transaction.id);
      toastSuccess({
        title: "Transaction deleted",
      });
      //              optional parameter
      emit("deleted", props.transaction.id);
    } catch (error) {
      toastError({
        title: "Transaction not deleted",
      });
    } finally {
      isLoading.value = false;
    }
  };

  // UDropdown options
  const options = [
    [
      {
        label: "Edit",
        icon: "i-solar-pen-broken",
        click: () => (isEditOpen.value = true),
      },
      {
        label: "Delete",
        icon: "i-solar-trash-bin-minimalistic-2-broken",
        click: deleteTransaction,
      },
    ],
  ];
</script>