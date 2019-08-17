import links from './src/links.json'
import packageJson from './package.json'
import replace from 'replace-in-file'
import { slice } from '.src/utils.js'

const html = links.map(line => {
  const sliced = slice(line).filter(s => s.text)
  return `<li class="step-4">${sliced.map(s => s.url ? `<a href="${s.url}">${s.text}</a>` : (s.text || '&nbsp;') ).join('') || '&nbsp;'}</li>`
}).join('')

replace({
  files: './build/index.html',
  from: /<links\/>/,
  to: html,
}).then(results => {
  if(results[0].hasChanged)
    console.log('Added links to no-script section')
  else
    console.error('Not found <links/> tag')
}).catch(error => {
  console.error('Error occurred:', error)
})

replace({
  files: './build/index.html',
  from: /<version\/>/,
  to: `<script>
    const VERSION = ${packageJson.version};
    const BUILD_TIME = ${Date()};
  </script>`,
}).then(results => {
  if(results[0].hasChanged)
    console.log('Added links to no-script section')
  else
    console.error('Not found <links/> tag')
}).catch(error => {
  console.error('Error occurred:', error)
})

