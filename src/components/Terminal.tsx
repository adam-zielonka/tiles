import { observer } from "mobx-react-lite";
import { store } from "../store/store";
import { Shutdown } from "./Shutdown";
import { Line } from "./Line";
import { Input } from "./Input";
import "./Terminal.scss";
import { Completion } from "./Completion";

export const Terminal = observer(() => {
  if (store.system.shutdown) {
    return <Shutdown/>;
  }

  const { history } = store;

  return <div className="Terminal" style={{fontFamily: store.style.font}}>
    <ul>
      {store.lines.value.map((line, i) => <Line key={i} line={line}/> )}
      {store.system.isInputAllowed && <Input/>}
      {history.showCompletion && <Completion completions={history.completions} index={history.completionIndex}/>}
    </ul>
  </div>;
});
