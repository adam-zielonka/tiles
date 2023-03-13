import { useState } from "react";

export function usePosition(inputRef: React.RefObject<HTMLInputElement>): [
  position: { start: number, end: number }, 
  updatePosition: () => void
] {
  const [position, setPosition] = useState({ start: 0, end: 0 });

  function updatePosition(): void {
    setPosition({
      start: inputRef.current?.selectionStart || 0,
      end: inputRef.current?.selectionEnd || 0,
    });
  }

  return [position, updatePosition];
}
