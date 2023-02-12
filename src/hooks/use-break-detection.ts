import { useEffect } from "react";

export function useBreakDetection(callback: () => void) {
  function detectBreak(e: KeyboardEvent) {
    if (e.key === "c" && e.ctrlKey) {
      callback();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", detectBreak);
    return () => document.removeEventListener("keydown", detectBreak);
  });
}
