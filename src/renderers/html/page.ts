import { template } from './template'

export function renderPage (title: string, entries: string[], toc: [string, string[]][]): string {
  return template`<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="style.css" rel="stylesheet">
  <title>${title}</title>
</head>
<body>

<main class="docs">
  <nav class="nav-container">
    <input class="search" placeholder="Search">

    ${toc.filter(([ , items]) => items.length).map(([name, items]) => template`<details class="nav-section" open>
      <summary>${name}</summary>
      <ul>
        ${items.map(item => template`<li><a href="#${item}">${item}</a></li>`)}
      </ul>
    </details>`)}
  </nav>

  <div class="doc-container">
    ${entries}
  </div>
</main>

<script>
var nav = document.querySelector('.nav-container')
var search = nav.querySelector('.search')

search.addEventListener('input', function () {
  var text = search.value.toLocaleUpperCase()

  nav.querySelectorAll('li').forEach(function (el) {
    el.hidden = !el.textContent.toLocaleUpperCase().includes(text)
  })

  nav.querySelectorAll('details').forEach(function (el) {
    el.hidden = Array.from(el.querySelectorAll('li')).every(function (el) { return el.hidden })
  })
})
</script>

</body>
</html>`
}
