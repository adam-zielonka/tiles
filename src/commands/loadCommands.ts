import frontMatter, { FrontMatterResult } from 'front-matter'

import cd from './cd.md'
import clear from './clear.md'
import description from './description.md'
import echo from './echo.md'
import font from './font.md'
import help from './help.md'
import notFound from './notFound.md'
import panic from './panic.md'
import ping from './ping.md'
import pong from './pong.md'
import shutdown from './shutdown.md'
import whoami from './whoami.md'

export type CommandProperties = {
  command: string
  alias?: string[]
  help?: string
}

export const loadCommands = (): FrontMatterResult<CommandProperties>[] => {
  return [
    frontMatter<CommandProperties>(cd),
    frontMatter<CommandProperties>(clear),
    frontMatter<CommandProperties>(description),
    frontMatter<CommandProperties>(echo),
    frontMatter<CommandProperties>(font),
    frontMatter<CommandProperties>(help),
    frontMatter<CommandProperties>(notFound),
    frontMatter<CommandProperties>(panic),
    frontMatter<CommandProperties>(ping),
    frontMatter<CommandProperties>(pong),
    frontMatter<CommandProperties>(shutdown),
    frontMatter<CommandProperties>(whoami),
  ]
}
