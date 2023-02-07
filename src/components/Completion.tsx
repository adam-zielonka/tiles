import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { store } from "../store/store";
import "./Completion.scss";

export const Completion = observer(() => {
  const { list, index, isVisible } = store.completion;
  
  useEffect(() => {
    isVisible && window.scrollTo(0, document.body.scrollHeight)
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return <li className="Completion">
    {list.map((completion, i) => <div key={i} className={i === index ? "active" : ""}>
      {completion}
    </div>)}
  </li>;
});
