import dateFormat from "dateformat"
import util from "util"

/**
 * 日時文字列をdateformatを指定してフォーマットする
 * @param {string} datestr - 日時文字列
 * @param {string} format - 指定のdateformat
 */
export function formatDateString(datestr, format) {
  return datestr ? dateFormat(new Date(datestr), format) : ''
}

/**
 * 日時文字列を現在からの相対時間文字列に変換する
 * @param {string} datestr - 日時文字列
 */
export function toRelactiveString(datestr) {
  const sec = (new Date().getTime() - new Date(datestr).getTime()) / 1000;
  if (sec < 60) { return util.format('%d秒前', sec) }
  if (sec < 3600) { return util.format('%d分前',　Math.floor(sec/60)) }
  if (sec < 86400) { return util.format('%d時間前', Math.floor(sec/3600)) }
  if (sec < 86400*365) { return util.format('%d日前', Math.floor(sec/86400)) }
  return util.format('%d年前', Math.floor(sec/86400*365))
}

export function escapeContent(c) {
  c = c.replace(/^<p>/, '')
  c = c.replace(/<\/p>$/, '')
  c = c.replace(/<script/gi, '&lt;script')
  return c
}

/**
 * Generate literal global RegExp
 * @param {string} str 
 */
const genRegExpL = (str) => {
  const escaped = str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
  const re = new RegExp(escaped, 'g')
  return re
}

/**
 * Extract custom emojis in content
 * @param {string} content 
 * @param {Array} emojis
 * @param {boolean} animation 
 */
export const extractEmojis = (content, emojis, animation) => {
  if (!emojis) return content
  if (!content) return content

  for (const emoji of emojis) {
    const re = genRegExpL(`:${emoji.shortcode}:`)
    const url = animation ? emoji.url : emoji.static_url
    const replace = `<img src="${url}" style="width:1em; height:1em" alt="${emoji.shortcode}" title="${emoji.shortcode}" />`
    content = content.replace(re, replace)
  }
  return content
}

export const convertContent = (status) => {
  let c = escapeContent(status.content)
  c = extractEmojis(c, status.emojis, false)
  status._converted = c
  return status
}

