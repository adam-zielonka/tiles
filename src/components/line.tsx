import { useEffect } from "react";
import { LinePrefix } from "./line-prefix";
import { Caret } from "./caret";
import { OutputLine } from "../types/line";
import { isCommandLine } from "../utils/line";

export function Line({line}: {line: OutputLine}) {
  useEffect(() => window.scrollTo(0, document.body.scrollHeight));

  if (isCommandLine(line)) {
    return <li className='Line'>
      <LinePrefix path={line.path}/> {line.value}
      {line.blink && <Caret/>}
    </li>;
  }

  return <li className='Line' style={{...line.style}} 
    dangerouslySetInnerHTML={{ __html: line.value }} />;
}

