import { CSSProperties } from "react";

type TextLine = {
  value: string
  style: CSSProperties
}

type CommandLine = {
  value: string
  blink: boolean
  path: string
}

type OutputLine = TextLine | CommandLine
