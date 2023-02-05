import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { store } from "../store/store";
import "./Input.scss";
import { LinePrefix } from "./LinePrefix";
import { InputText } from "./InputText";

export const Input = observer(() => {
  const { history, path, system } = store;

  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState({ start: 0, end: 0 });

  function updateStartEnd(): void {
    setPosition({
      start: inputRef.current?.selectionStart || 0,
      end: inputRef.current?.selectionEnd || 0,
    });
  }

  function moveCaretToEnd(): void {
    setTimeout(() => {
      inputRef.current?.setSelectionRange(inputRef.current?.value.length, inputRef.current?.value.length);
      updateStartEnd();
    }, 10);
  }

  function keydown(event: KeyboardEvent): void {
    switch (event.key) {
    case "Enter":
      if (history.completionIndex > -1 && history.completions[history.completionIndex]) {
        history.set(`${history.completions[history.completionIndex]} `);
        history.resetCompletions();
        console.log("history.value", history.value);
      } else {
        history.resetCompletions();
        void system.addCommand(history.value);
        history.add();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      history.up();
      moveCaretToEnd();
      history.resetCompletions();
      break;
    case "ArrowDown":
      event.preventDefault();
      history.down();
      moveCaretToEnd();
      history.resetCompletions();
      break;
    case "Tab":
      event.preventDefault();
      history.nextCompletion();
      break;
    }

    inputRef.current?.focus();
    updateStartEnd();
  }

  function click(): void {
    inputRef.current?.focus();
    updateStartEnd();
  }

  useEffect(() => {
    document.addEventListener("keydown", keydown);
    document.addEventListener("click", click);

    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("click", click);
    };
  }, []);

  return <li className="Input">
    <LinePrefix path={path.value}/> <InputText value={history.value} start={position.start} end={position.end}/>
    <input
      ref={inputRef}
      value={history.value}
      onSelect={updateStartEnd}
      onKeyUp={updateStartEnd}
      onKeyDown={updateStartEnd}
      onChange={updateStartEnd}
      onInput={e => {
        history.set(e.currentTarget.value);
        updateStartEnd();
      }}
    />
  </li>;
});
