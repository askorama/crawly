import { assertEquals } from 'https://deno.land/std@0.221.0/assert/mod.ts'
import { generalPurposeCrawler } from '../src/index.ts'

Deno.test('General Purpose Crawler', async () => {
  const mockFileURL = new URL('./mocks/mock-orama-docs.html', import.meta.url)
  const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)
  const crawledContent = generalPurposeCrawler(
    'https://docs.askorama.ai/open-source/usage/insert',
    HTMLFile,
  )

  assertEquals(crawledContent.length, 11)
})

Deno.test('General Purpose Crawler data attributes', async () => {
  const mockFileURL = new URL(
    './mocks/mock-custom-attrs.html',
    import.meta.url,
  )
  const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)
  const crawledContent = generalPurposeCrawler(
    'https://docs.askorama.ai/open-source/usage/insert',
    HTMLFile,
  )
  assertEquals(crawledContent, [
    {
      title: 'Header',
      content: 'I should exist',
      path: '/open-source/usage/insert#header',
      category: '',
      section: 'open-source',
    },
  ])
})
