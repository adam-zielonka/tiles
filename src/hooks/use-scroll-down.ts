import { useEffect } from "react";

export function useScrollDown() {
  useEffect(() => window.scrollTo(0, document.body.scrollHeight));
}
