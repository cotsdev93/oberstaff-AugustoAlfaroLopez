// src/hooks/useInfiniteScroll.js
import { useEffect, useRef } from "react";

export function useInfiniteScroll(onReachEnd, { rootMargin = "400px" } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && onReachEnd?.()),
      { root: null, rootMargin, threshold: 0 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onReachEnd, rootMargin]);

  return ref;
}
