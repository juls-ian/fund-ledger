export const useAvatarUrl = () => {
  // GET CURRENT USER METADATA (name of avatar image)
  // PUBLIC URL OF THE IMAGE
  // WATCH USER FOR ANY CHANGES - always display image of user

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  //   fetcher of actual url of current user avatar
  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) return null;

    // function from supabase (read docs)
    const { data } = supabase.storage.from("avatars").getPublicUrl(user.value?.user_metadata?.avatar_url);

    return data.publicUrl;
  };

  const url = ref(getPublicUrl());

  watch(user, () => (url.value = getPublicUrl()), { immediate: true });

  return { url };
};
