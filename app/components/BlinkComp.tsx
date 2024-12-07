"use client";

import { envHeliusRpcUrl } from "@/lib/envConfig";
import { Action, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import "@dialectlabs/blinks/index.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const DynamicBlink = dynamic(
  () => import("@dialectlabs/blinks").then((mod) => mod.Blink),
  { ssr: false }
);
import { Skeleton } from "@/components/ui/skeleton";

// Testing
const BlinkComp = ({
  propActionApiUrl,
  websiteText,
  className = "",
}: {
  propActionApiUrl: string;
  websiteText: string;
  className?: string;
}) => {
  const [action, setAction] = useState<Action | null>(null);

  const actionApiUrl = propActionApiUrl;
  const { adapter } = useActionSolanaWalletAdapter(envHeliusRpcUrl as string);
  // useAction initiates registry, adapter and fetches the action.
  const { action: actionUrl } = useAction({
    url: actionApiUrl,
    adapter,
  });

  useEffect(() => {
    console.log("actionUrl", actionUrl);
    console.log("actionApiUrl", actionApiUrl);
    if (actionUrl) {
      setAction(actionUrl as Action);
    }
  }, [actionUrl]);

  return (
    <div className={className}>
      {action ? (
        <DynamicBlink
          stylePreset="default"
          action={action}
          securityLevel="all"
          websiteText={websiteText}
          // websiteText="sendarcade"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[320px]" />
          <Skeleton className="h-[16px]" />
          <Skeleton className="h-[16px]" />
          <Skeleton className="h-[32px]" />
          <div className="flex gap-2">
            <Skeleton className="h-[32px]" />
            <Skeleton className="h-[32px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlinkComp;
