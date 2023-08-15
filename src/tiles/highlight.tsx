import { observer } from "mobx-react-lite";
import { store } from "./store";

export const Highlight = observer(function Highlight({ children }: { children: string }) {
  if (!store.highlight) return <span>{children}</span>;

  return <span className="Highlight">{children}</span>;
});
