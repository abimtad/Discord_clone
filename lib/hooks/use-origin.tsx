import { useEffect, useState } from "react";

export default function useOrigin() {
  const [isMounted, setIsMounted] = useState(false);
  const origin =
    window && window?.location?.origin ? window.location.origin : "";

  useEffect(() => {
    setIsMounted(true);
  });

  if (isMounted) return origin;
}
