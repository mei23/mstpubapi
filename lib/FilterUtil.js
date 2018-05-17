
/**
 * text to RegExps
 * @param {*} text 
 */
exports.parseDef = function (text) {
  if (text == null) return []

  let regexes = []
  try {
    text.split(/[\r\n]+/).forEach(line => {
      if (!line.match(/.+/)) return
      const regex = new RegExp(line, 'gi')
      regexes.push(regex)
    });
  } catch (error) {
    return []
  }
  return regexes
}

/**
 * StringのどれかがRegExpのどれかにマッチするか
 * @param {Array} strs Strings
 * @param {Array} regs RegExps
 */
exports.checkStrReg = function (strs, regs) {
  return strs.some(str => {
    return regs.some(reg => {
      if (reg.test(str)) {
        console.log(str)
        return true
      }
    })
  }) 
}