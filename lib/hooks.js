import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Refresh the current route and fetch new data from the server without
 * losing client-side browser or React state.
 *
 * @example
 * const { refresh } = useRefreshData();
 *
 * const onSubmit = async (event) => {
 *  // Some async operation doing something with the data
 *  refresh() // refresh once it's done and there is new data
 * }
 */
export function useRefreshData() {
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return { refresh };
}
