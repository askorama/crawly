import slugify from 'npm:slugify'

export function parseSectionFromURL(url: string) {
  const uri = new URL(url)
  const path = uri.pathname
  const pathParts = path.split('/')
  return pathParts[1]
}

export function getPathFromURL(url: string) {
  const uri = new URL(url)
  return uri.pathname
}

export function URLToAnchorPath(url: string, sectionTitle: string) {
  const path = getPathFromURL(url)
  const anchor = slugify.default(sectionTitle, { lower: true, strict: true })

  return `${path}#${anchor}`
}
