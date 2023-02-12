import { marked, Renderer } from "marked";
import { useEffect } from "react";
import { LinePrefix } from "./line-prefix";
import { Caret } from "./caret";
import { OutputLine } from "../types/line";
import { isCommandLine } from "../utils/line";
import "./line.scss";

Renderer.prototype.paragraph = text => text;

export function Line({line}: {line: OutputLine}) {
  useEffect(() => window.scrollTo(0, document.body.scrollHeight));

  if (isCommandLine(line)) {
    return <li className='Line'>
      <LinePrefix path={line.path}/> {line.value}
      {line.blink && <Caret/>}
    </li>;
  }

  return <li className='Line' style={{...line.style}} 
    dangerouslySetInnerHTML={{ __html: marked(line.value || "\u00a0")}} />;
}

