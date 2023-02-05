import { marked, Renderer } from "marked";
import { useEffect } from "react";
import { isCommandLine, LineType } from "../store/lines";
import { LinePrefix } from "./LinePrefix";
import { Caret } from "./Caret";
import "./Line.scss";

Renderer.prototype.paragraph = text => text;

export function Line({line}: {line: LineType}) {
  useEffect(() => window.scrollTo(0, document.body.scrollHeight));

  if (isCommandLine(line)) {
    return <li className='Line'>
      <LinePrefix path={line.path}/> {line.value}
      {line.blink && <Caret/>}
    </li>;
  }

  return <li className='Line' style={{
    color: line.style.color,
    fontWeight: line.style.fontWeight,
    fontSize: line.style.fontSize,
  }} dangerouslySetInnerHTML={{ __html: marked(line.value || "\u00a0")}} />;
}
