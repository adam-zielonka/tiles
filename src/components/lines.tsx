import { observer } from "mobx-react-lite";
import { store } from "../store/store";
import { Line } from "./line";

export const Lines = observer(() => {
  return <>{store.output.lines.map((line, i) => <Line key={i} line={line}/>)}</>;
});
