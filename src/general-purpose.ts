import { load } from 'npm:cheerio@1.0.0-rc.12'
import { parseSectionFromURL, URLToAnchorPath } from './utils.ts'

export type GeneralPurposeCrawlerResult = {
  title: string
  content: string
  path: string
  category: string
  section: string
}

export function generalPurposeCrawler(url: string, html: string): GeneralPurposeCrawlerResult[] {
  const $ = load(html)

  const results: GeneralPurposeCrawlerResult[] = []
  const category = ''

  const firstH1Text = $('h1').first().clone().children().remove('script').end().text().trim()

  let currentHeaderText = firstH1Text
  let currentContent = ''

  for (const header of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    $(header)
      .first()
      .nextAll()
      .each(function () {
        const isHeader = $(this).is('h1, h2, h3, h4, h5, h6')
        if (isHeader) {
          if (currentHeaderText && currentContent) {
            results.push({
              title: currentHeaderText,
              content: currentContent,
              path: URLToAnchorPath(url, currentHeaderText),
              category,
              section: parseSectionFromURL(url),
            })
          }
          currentHeaderText = $(this).clone().children().remove('script').end().text().trim()
          currentContent = ''
        } else if ($(this).is('p')) {
          currentContent += `${$(this).clone().children().remove('script').end().text().trim()} `
        }
      })
  }

  if (currentHeaderText && currentContent) {
    results.push({
      title: currentHeaderText,
      content: currentContent,
      path: URLToAnchorPath(url, currentHeaderText),
      category,
      section: parseSectionFromURL(url),
    })
  }

  return results
}
