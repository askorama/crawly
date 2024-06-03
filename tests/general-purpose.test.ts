import { assertEquals } from 'https://deno.land/std@0.221.0/assert/mod.ts'
import { generalPurposeCrawler } from '../src/index.ts'

const mockUrl = 'https://docs.askorama.ai/open-source/usage/insert'

Deno.test('General Purpose Crawler - Orama Docs', async () => {
  const mockFileURL = new URL('./mocks/mock-orama-docs.html', import.meta.url)
  const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)
  const crawledContent = generalPurposeCrawler(
    mockUrl,
    HTMLFile,
  )

  assertEquals(crawledContent.length, 11)
})

Deno.test('General Purpose Crawler - Example page', async () => {
  const mockFileURL = new URL('./mocks/mock-example-page.html', import.meta.url)
  const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)
  const crawledContent = generalPurposeCrawler(
    mockUrl,
    HTMLFile,
  )

  assertEquals(crawledContent.length, 4)
  assertEquals(crawledContent, [
    { 
      category: "",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl in purus ultricies. List item\nList item\nList item\nList item",
      path: "/open-source/usage/insert#example-page-header",
      section: "open-source",
      title: "Example Page Header",
    },
    {
      category: "",
      content: "Nullam nec nisl in purus ultricies, auctor ultricies nunc. Nullam nec nisl in purus ultricies, auctor ultricies nunc.",
      path: "/open-source/usage/insert#example-page-sub-header-1",
      section: "open-source",
      title: "Example Page Sub-Header 1",
    },
    {
      category: "",
      content: "List item\nList item\nList item\nList item",
      path: "/open-source/usage/insert#sub-header",
      section: "open-source",
      title: "Sub-header",
     },
     {
      category: "",
      content: "Nullam nec nisl in purus ultricies, auctor ultricies nunc. Nullam nec nisl in purus ultricies, auctor ultricies nunc.",
      path: "/open-source/usage/insert#example-page-sub-header-2",
      section: "open-source",
      title: "Example Page Sub-Header 2",
    },
  ])
})

Deno.test('General Purpose Crawler - Data attributes', async () => {
  const mockFileURL = new URL(
    './mocks/mock-custom-attrs.html',
    import.meta.url,
  )
  const HTMLFile = await Deno.readTextFile(mockFileURL.pathname)
  const crawledContent = generalPurposeCrawler(
    mockUrl,
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
