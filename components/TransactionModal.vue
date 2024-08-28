<template>
  <UModal v-model="isOpenn">
    <UCard>
      <template #header>
        {{ isEditing ? "Edit" : "Add" }} Transaction
      </template>
      <!-- :state is validation | ref is template ref -->
      <UForm
        :state="state"
        :schema="interSchema"
        ref="form"
        @submit.prevent="save"
      >
        <UFormGroup
          label="Transaction type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            :disabled="isEditing"
            placeholder="Select transaction type"
            :options="types"
            v-model="state.type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup
          label="Date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-solar-calendar-date-bold"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup label="Category" name="category" class="mb-4">
          <USelect
            placeholder="Description"
            :options="categories"
            v-model="state.category"
            v-if="state.type === 'Expense'"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="sky"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
  import { categories, types } from "~/utils/constants";
  import { z } from "zod";

  const props = defineProps({
    modelValue: Boolean,
    transaction: {
      type: Object,
      required: false,
    },
  });
  const isEditing = computed(() => props.transaction);
  //                        event name should be this
  const emit = defineEmits(["update:modelValue", "saved"]);

  // VALIDATION SCHEMA
  const defaultSchema = z.object({
    amount: z.number().positive("Amount must be more than 0"),
    created_at: z.string(),
    description: z.string().optional(),
  });

  const incomeSchema = z.object({
    type: z.literal("Income"),
  });

  const expenseSchema = z.object({
    type: z.literal("Expense"),
    //additional field to validate
    category: z.enum(categories),
  });

  const investmentSchema = z.object({
    type: z.literal("Investment"),
  });

  const savingsSchema = z.object({
    type: z.literal("Savings"),
  });

  // INTERSECTION
  const interSchema = z.intersection(
    z.discriminatedUnion("type", [
      incomeSchema,
      expenseSchema,
      investmentSchema,
      savingsSchema,
    ]),
    defaultSchema
  );

  const isOpenn = computed({
    get: () => props.modelValue,
    //               event name,    emit value into parent component
    set: (value) => {
      if (!value) resetForm();
      emit("update:modelValue", value);
    },
  });

  // TRIGGERING VALIDATION
  const form = ref();
  const isLoading = ref(false);
  const supabase = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();

  // SAVING
  const save = async () => {
    //from nuxt api (if there's error)
    if (form.value.errors.length) {
      return;
    }

    // store into supabase
    isLoading.value = true;
    try {
      const { error } = await supabase
        .from("transactions")
        //            add             edit
        .upsert({ ...state.value, id: props.transaction?.id });
      if (!error) {
        toastSuccess({
          title: "Transaction saved",
        });
        // closing the modal
        isOpenn.value = false;
        // saving the transaction
        emit("saved");
        return;
      }
      throw error;
    } catch (error) {
      toastError({
        title: "Transaction not saved",
        description: error.message,
      });
    } finally {
      isLoading.value = false;
    }
  };

  // STORES ALL DATA OF FORM FIELDS
  const initialState = isEditing.value
    ? {
        type: props.transaction.type,
        amount: props.transaction.amount,
        created_at: props.transaction.created_at.split("T")[0],
        description: props.transaction.description,
        category: props.transaction.category,
      }
    : {
        type: undefined,
        amount: 0,
        created_at: undefined,
        description: undefined,
        category: undefined,
      };

  const state = ref({ ...initialState });

  const resetForm = () => {
    // overwrite existing value from the state
    Object.assign(state.value, initialState);
    // clearing up all form errors
    form.value.clear();
  };
</script>