import { useState } from "react";

export function useVisibilityDelay(delay: number) {
  const [isVisible, setVisible] = useState(false);

  !isVisible && setTimeout(() => setVisible(true), delay);

  return isVisible;
}
