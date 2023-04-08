import { lazy, Suspense } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../store/store";
import { Completion } from "./completion";
import { Lines } from "./lines";
import { Input } from "./input";
import { WaitALiteMore } from "./wait-a-lite-more";
import { useBreakDetection } from "../hooks/use-break-detection";

const Shutdown = lazy(() => import("./shutdown"));

export const Terminal = observer(() => {
  useBreakDetection(() => store.system.break());

  if (store.system.shutdown) {
    return <Suspense fallback={<WaitALiteMore/>}>      
      <Shutdown/>
    </Suspense>;
  }

  return <div className="Terminal" style={{fontFamily: store.style.font}}>
    <ul>
      <Lines/>
      {store.system.isInputAllowed && <Input/>}
      <Completion/> 
    </ul>
  </div>;
});
