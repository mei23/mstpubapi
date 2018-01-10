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
    const replace = `<img class='emoji' src="${url}" alt="${emoji.shortcode}" title="${emoji.shortcode}" />`
    content = content.replace(re, replace)
  }
  return content
}

// ニコる
const nicoruRotated = new RegExp(/:(nicoru)(?:(\d+))?:/, 'g')
const nicoruImage = 'https://twemoji.maxcdn.com/2/72x72/1f603.png'

export const extractNicorus = (content) => {
  if (!content) return content

  content = content.replace(nicoruRotated, `<img class='emoji' src='${nicoruImage}' style='transform:rotate($2deg)' alt='$&' title='$&' />`)
  return content
}

export const extractProfileEmojis =  (content, emojis) => {
  if (!emojis) return content
  if (!content) return content

  for (const emoji of emojis) {
    const re = genRegExpL(`:${emoji.shortcode}:`)
    const url = emoji.url
    const replace = `<img class='emoji' src="${url}" alt="${emoji.shortcode}" title="${emoji.shortcode}" />`
    content = content.replace(re, replace)
  }
  return content
}

export const convertContent = (status) => {
  let c = escapeContent(status.content)
  c = extractEmojis(c, status.emojis, false)
  c = extractNicorus(c)
  c = extractProfileEmojis(c, status.profile_emojis)
  status._converted = c
  return status
}

