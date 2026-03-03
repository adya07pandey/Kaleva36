import { useRegisterSW } from "virtual:pwa-register/react";

export function usePWAUpdate() {
  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW();

  return { needRefresh, updateServiceWorker };
}