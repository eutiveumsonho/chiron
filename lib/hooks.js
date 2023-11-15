import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Refresh the current route and fetch new data from the server without
 * losing client-side browser or React state.
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
