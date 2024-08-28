export const useRedirectIfAuthenticated = (url = "/") => {
  // if user is already authenticated
  // automatically populated once signed in
  const user = useSupabaseUser();

  // data of authenticated user
  watch(
    user,
    (user) => {
      if (user) {
        return navigateTo(url);
      }
    },
    { immediate: true }
  );
  return { user };
};
