// Writes the files that sit at the root of the deployed site next to the
// review/ and public/ builds: a redirect to the review page and .nojekyll.
import { mkdirSync, writeFileSync } from 'node:fs'

const target = process.argv[2] ?? 'review/'
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=./${target}" />
    <link rel="canonical" href="./${target}" />
    <meta name="robots" content="noindex" />
    <title>ELEVATE</title>
    <script>window.location.replace('./${target}' + window.location.hash)</script>
  </head>
  <body>
    <p>Redirecting to <a href="./${target}">${target}</a>.</p>
  </body>
</html>
`
mkdirSync('dist', { recursive: true })
writeFileSync('dist/index.html', html)
writeFileSync('dist/.nojekyll', '')
console.log(`dist/index.html -> ./${target}`)
