import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, sub } from "date-fns";

export const useSelectedTimePeriod = (period) => {
  const current = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          // current year
          from: startOfYear(new Date()),
          to: endOfYear(new Date()),
        };
      case "Monthly":
        return {
          // current month
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        };
      case "Daily":
        return {
          // current day
          from: startOfDay(new Date()),
          to: endOfDay(new Date()),
        };
    }
  });

  const previous = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          //last calendar year
          //              subtract to get last year
          from: startOfYear(sub(new Date(), { years: 1 })),
          to: endOfYear(sub(new Date(), { years: 1 })),
        };
      case "Monthly":
        return {
          //last month
          //              subtract to get last month
          from: startOfMonth(sub(new Date(), { months: 1 })),
          to: endOfMonth(sub(new Date(), { months: 1 })),
        };
      case "Daily":
        return {
          //last  day
          //              subtract to get previous day
          from: startOfDay(sub(new Date(), { days: 1 })),
          to: endOfDay(sub(new Date(), { days: 1 })),
        };
    }
  });

  return { current, previous };
};
