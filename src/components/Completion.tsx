import { useEffect } from "react";
import "./Completion.scss";

export function Completion({ list, index }:{ list: string[], index: number}) {
  useEffect(() => window.scrollTo(0, document.body.scrollHeight));

  return <li className="Completion">
    {list.map((completion, i) => <div key={i} className={i === index ? "active" : ""}>
      {completion}
    </div>)}
  </li>;
}
