import { CSSProperties } from "react";

export type TextLine = {
  value: string
  style: CSSProperties
}

export type CommandLine = {
  value: string
  blink: boolean
  path: string
}

export type OutputLine = TextLine | CommandLine
