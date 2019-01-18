import * as React from 'react'

export function renderPage (title: string, content: JSX.Element) {
  return <html>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
      <title>{title}</title>
    </head>
    <body>
      {content}
    </body>
  </html>
}
