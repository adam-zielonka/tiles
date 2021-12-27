import frontMatter, { FrontMatterResult } from 'front-matter'

import cd from './cd.md'
import clear from './clear.md'
import description from './description.md'
import echo from './echo.md'
import font from './font.md'
import help from './help.md'
import ls from './ls.md'
import matrix from './matrix.md'
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

export function loadCommands(): FrontMatterResult<CommandProperties>[] {
  return [
    cd,
    clear,
    description,
    echo,
    font,
    help,
    ls,
    matrix,
    notFound,
    panic,
    ping,
    pong,
    shutdown,
    whoami,
  ].map(command => frontMatter<CommandProperties>(command))
}
