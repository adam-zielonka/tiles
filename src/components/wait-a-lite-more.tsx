import { useVisibilityDelay } from "../hooks/use-visibility-delay";

export function WaitALiteMore() {
  const isVisible = useVisibilityDelay(500);

  if (!isVisible) {
    return null;
  }

  return <div className="Terminal">
    <ul>
      <li>Wait a lite more...</li>
    </ul>
  </div>;
}
