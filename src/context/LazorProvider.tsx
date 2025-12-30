import type { ReactNode } from 'react';
import { LazorkitProvider } from '@lazorkit/wallet';

export function LazorProvider({ children }: { children: ReactNode }) {
  const rpcUrl = import.meta.env.VITE_LAZORKIT_RPC_URL;
  const paymasterUrl = import.meta.env.VITE_LAZORKIT_PAYMASTER_URL;
  const portalUrl = import.meta.env.VITE_LAZORKIT_PORTAL_URL; 

  if (!rpcUrl || !paymasterUrl || !portalUrl) {
    console.error("Missing Environment Variables! Check .env");
    return null; 
  }

  return (
    <LazorkitProvider
      rpcUrl={rpcUrl}
      portalUrl={portalUrl}
      paymasterConfig={{
        paymasterUrl: paymasterUrl,
      }}
    >
      {children}
    </LazorkitProvider>
  );
}