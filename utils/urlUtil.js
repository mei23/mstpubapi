
export function getPagePath(page){
  let path = `./${page}`
  if (typeof window !== 'undefined'
    && window.location.pathname.match(/html$/)) { path += '.html' }
  return path
}

