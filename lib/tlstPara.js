

export default class  {

  static create(newType, newMax, newSince, newCount) {
  
    /** timeline url */
    let queryUrl = null
    /** timeline para */
    let queryPara = {
      limit: newCount > 0 ? newCount : 20,
    }
    /** streaming endpoint */
    let streamUrl = null

    /** need nsfw filter after timeline/streaming fetch */
    let nsfwFilter = 0
    /** need media filter after streaming fetch */
    let mediaOnly = false

    if (newType == '') {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
      streamUrl = 'public/local'
    }
    // メディアタイムライン(Pawoo / v2.3.0)
    else if (newType.match(/^local-media(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.media = 'true'      // Pawoo
      queryPara.only_media = 'true' // v2.3.0
      queryPara.limit = 10
      queryPara.local = 'true'
      streamUrl = 'public/local'
      mediaOnly = true
    }
    else if (newType.match(/^fera-media(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.media = 'true'
      queryPara.only_media = 'true'
      queryPara.limit = 10
      streamUrl = 'public'
      mediaOnly = true
    }
    else if (newType.match(/^local(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      queryPara.local = 'true'
      streamUrl = 'public/local'
    }
    else if (newType.match(/^fera(-nsfw|-sfw)?$/)) {
      queryUrl = '/api/v1/timelines/public'
      // local=false じゃなくてキー自体送っちゃだめっぽい
      streamUrl = 'public'
    }
    else {
      const matchTags = newType.match(/^([^-]+)(-media)?(-nsfw|-sfw)?$/)
      if (matchTags) {
        const tag = matchTags[1]
        queryUrl = `/api/v1/timelines/tag/${tag}`
        streamUrl = `hashtag?tag=${tag}`
        if (matchTags[2]) {
          queryPara.media = 'true' // PawooにはタグメディアTLないけど
          queryPara.only_media = 'true' // v2.3.0
          mediaOnly = true
        }
      }
      else {
        queryUrl = `/api/v1/timelines/tag/${newType}`
        streamUrl = `hashtag?tag=${newType}`
      }
    }

    if (newType.match(/-nsfw$/)) nsfwFilter = -1
    if (newType.match(/-sfw$/))  nsfwFilter =  1

    if (newMax > 0)   queryPara.max_id   = newMax
    if (newSince > 0) queryPara.since_id = newSince

    return {
      queryUrl: queryUrl,
      queryPara: queryPara,
      nsfwFilter: nsfwFilter,
      mediaOnly: mediaOnly,
      streamUrl: streamUrl,
    }
  }
}