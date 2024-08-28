export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: "i-solar-check-circle-broken",
        color: "green",
      });
    },
    toastError: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: "i-solar-expressionless-square-broken",
        color: "red",
      });
    },
  };
};
