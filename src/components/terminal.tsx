import { lazy, Suspense, useState } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../store/store";
import { Completion } from "./completion";
import { Line } from "./line";
import { Input } from "./input";
import "./terminal.scss";

const Shutdown = lazy(() => import("./Shutdown"));

export const Terminal = observer(() => {
  if (store.system.shutdown) {
    return <Suspense fallback={<WaitALiteMore/>}>      
      <Shutdown/>
    </Suspense>;
  }

  return <div className="Terminal" style={{fontFamily: store.style.font}}>
    <ul>
      {store.output.lines.map((line, i) => <Line key={i} line={line}/> )}
      {store.system.isInputAllowed && <Input/>}
      <Completion/> 
    </ul>
  </div>;
});

function WaitALiteMore() {
  const [isVisible, setVisible] = useState(false);

  !isVisible && setTimeout(() => setVisible(true), 500);

  if (!isVisible) {
    return null;
  }

  return <div className="Terminal">
    <ul>
      <li>Wait a lite more...</li>
    </ul>
  </div>;
}
