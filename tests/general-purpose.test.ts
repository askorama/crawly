import { assertEquals } from 'https://deno.land/std@0.221.0/assert/mod.ts'
import { generalPurposeCrawler } from '../src/index.ts'

const mockFileURL = new URL('./mocks/mock-orama-docs.html', import.meta.url)
const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)

Deno.test('General Purpose Crawler', () => {
  const crawledContent = generalPurposeCrawler(
    'https://docs.askorama.ai/open-source/usage/insert',
    HTMLFile,
  )

  assertEquals(crawledContent.length, 11)
})
