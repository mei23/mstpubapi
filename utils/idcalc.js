
/**
 * ステータスIDのリビジョンを取得する
 */
export function getIdRevision(id) {
  return id > 90000000000000000 ? 2 : 1
}

const B_16 = Math.pow(2, 16);

export function idToMs(id) {
    // UNIX Time (ms) = ID >> 16
    return id / B_16;
}

export function msToId(ms) {
    // ID = UNIX Time (ms) << 16

    // << 16
    let id = ms * B_16;
    // & 0xFFFF
    id = parseInt(id / B_16) * B_16;
    return id;
}

export function addMs(id, ms) {
  const msSrc = idToMs(id)
  const idDst = msToId(msSrc + ms)
  return idDst
}
