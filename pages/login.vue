<template>
	<UCard v-if="!success">
		<template #header>Sign-in to Fund Ledger</template>

		<form @submit.prevent="handleLogin">
			<UFormGroup
				label="Email"
				name="email"
				class="mb-4"
				:required="true"
				help="You will receive an email with the confirmation link">
				<UInput type="email" placeholder="Email" required v-model="email" />
			</UFormGroup>
			<UButton type="submit" variant="solid" color="sky" :loading="pending" :disabled="pending">Sign in</UButton>
		</form>
	</UCard>
	<UCard v-else>
		<template #header>Email has been sent</template>

		<div class="text-center">
			<p class="mb-4">
				We have sent an email to
				<strong>{{ email }}</strong>
				with a link to sign in
			</p>
			<!-- <p>
				<strong>Important:</strong>
				The link will expire in 5 minutes
			</p> -->
			<p>
				<strong>Notice:</strong>
				I have disabled the sign in for now due to domain hosting cost needed for the email authentication, please go to
				the home page for now and explore the app
			</p>
		</div>
	</UCard>
</template>

<script setup>
	const success = ref(false);
	const email = ref("");
	const pending = ref(false);
	const { toastSuccess, toastError } = useAppToast();
	const supabase = useSupabaseClient();
	const redirectUrl = useRuntimeConfig().public.baseUrl; // have same properties on nuxt.config
	// useRedirectIfAuthenticated();

	// ACTUAL SIGNING IN
	const handleLogin = async () => {
		pending.value = true;

		try {
			const { error } = await supabase.auth.signInAnonymously({
				email: email.value,
				options: {
					emailRedirectTo: `${redirectUrl}/confirm`,
				},
			});
			//   if there's error
			if (error) {
				toastError({
					title: "Error authenticating",
					description: error.message,
				});
			} else {
				success.value = true;
			}
		} finally {
			pending.value = false;
		}
	};
</script>
