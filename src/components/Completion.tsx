import "./Completion.scss";

export function Completion(props: { completions: string[], index: number }) {
  return <li className="Completion">
    {props.completions.map((completion, i) => <div key={i} className={i === props.index ? "active" : ""}>
      {completion}
    </div>)}
  </li>;
}
