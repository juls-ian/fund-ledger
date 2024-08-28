<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        :options="transactionPeriodOptions"
      />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
  import { z } from "zod";
  import { transactionPeriodOptions } from "~/utils/constants";

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { toastSuccess, toastError } = useAppToast();
  const pending = ref(false);

  const state = ref({
    // setting default value                   name of setting
    transactionView:
      user.value.user_metadata?.preferences ?? transactionPeriodOptions[1], // if null it gets the default[1]
  });

  const schema = z.object({
    transactionView: z.enum(transactionPeriodOptions),
  });

  const saveSettings = async () => {
    pending.value = true;

    try {
      const { error } = await supabase.auth.updateUser({
        // metadata
        data: {
          preferences: state.value.transactionView,
        },
      });

      if (error) throw error;
      toastSuccess({
        title: "Settings updated",
      });
    } catch (error) {
      toastError({
        title: "Error updating settings",
        description: error.message,
      });
    } finally {
      pending.value = false;
    }
  };
</script>
