import type { Cheerio, AnyNode } from 'npm:cheerio@1.0.0-rc.12'
import { load } from 'npm:cheerio@1.0.0-rc.12'
import { parseSectionFromURL, URLToAnchorPath } from './utils.ts'

export type GeneralPurposeCrawlerOptions = {
  parseCodeBlocks?: boolean
  customHeaderSelector?: string
  customContentSelector?: string
}

export type GeneralPurposeCrawlerResult = {
  title: string
  content: string
  path: string
  category: string
  section: string
}

const defaultOptions: GeneralPurposeCrawlerOptions = {
  parseCodeBlocks: true,
  customHeaderSelector: '[data-orama-header]',
  customContentSelector: '[data-orama-content]',
}

export function generalPurposeCrawler(
  url: string,
  html: string,
  options: GeneralPurposeCrawlerOptions = {},
): GeneralPurposeCrawlerResult[] {
  const crawlerOptions = { ...defaultOptions, ...options }
  const $ = load(html)
  const results: GeneralPurposeCrawlerResult[] = []
  const category = ''

  let currentHeaderText = ''
  let currentContent = ''

  function parseTable($table: Cheerio<AnyNode>) {
    let tableContent = ''
    const $headers = $table.find('th')
    const headerTexts = $headers.map((_, el) => $(el).text().trim()).get()
    
    $table.find('tr').each((_, row) => {
      const $cells = $(row).find('td')
      if ($cells.length > 0) {
        $cells.each((colIndex, cell) => {
          const cellText = $(cell).text().trim()
          if (headerTexts[colIndex]) {
            tableContent += `${headerTexts[colIndex]}: ${cellText}; `
          }
        })
        tableContent = `${tableContent.trim()}\n`
      }
    })
    
    return tableContent
  }

  $('*').each(function () {
    if (
      $(this).is('h1, h2, h3, h4, h5, h6') ||
      $(this).is(crawlerOptions.customHeaderSelector)
    ) {
      if (currentHeaderText && currentContent) {
        results.push({
          title: currentHeaderText,
          content: currentContent.trim(),
          path: URLToAnchorPath(url, currentHeaderText),
          category,
          section: parseSectionFromURL(url),
        })
      }
      currentHeaderText = $(this).text().trim()
      currentContent = ''
    } else if (crawlerOptions.parseCodeBlocks && $(this).is('pre code')) {
      currentContent += `\n\n${$(this).text().trim()}\n\n`
    } else if ($(this).is('p')) {
      currentContent += `${$(this).text().trim()} `
    } else if ($(this).is('ul, ol')) {
      $(this)
        .find('li')
        .each(function () {
          currentContent += `${$(this).text().trim()}\n`
        })
    } else if ($(this).is('table')) {
      currentContent += parseTable($(this))
    } else if ($(this).is(crawlerOptions.customContentSelector)) {
      currentContent += `${$(this).text().trim()} `
    }
  })

  if (currentHeaderText && currentContent) {
    results.push({
      title: currentHeaderText,
      content: currentContent.trim(),
      path: URLToAnchorPath(url, currentHeaderText),
      category,
      section: parseSectionFromURL(url),
    })
  }

  return results
}