<template>
  <UForm :state="state" :schema="zodSchema" @submit.prevent="editProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <!-- vmodel to modify state -->
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both and new addresses upon changing email"
    >
      <UInput v-model="state.email" />
    </UFormGroup>
    <UButton
      type="submit"
      color="sky"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
  import { z } from "zod";

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { toastSuccess, toastError } = useAppToast();
  const pending = ref(false);

  const state = ref({
    // data from try block data
    name: user.value.user_metadata?.full_name,
    email: user.value.email,
  });

  const zodSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email(),
  });

  const editProfile = async () => {
    pending.value = true;

    try {
      const userData = {
        // user metadata
        data: {
          // custom name
          full_name: state.value.name,
        },
      };
      // conditionally change email if modified
      if (state.value.email !== user.value.email) {
        data.email = state.value.email;
      }
      console.log(userData);

      // supabase method
      const { error } = await supabase.auth.updateUser(userData);

      // if there's an error stop execution and pass to catch
      if (error) throw error;
      toastSuccess({
        title: "Profile updated",
      });
    } catch (error) {
      toastError({
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      pending.value = false;
    }
  };
</script>