
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const writeStream = fs.createWriteStream('post.csv')

// Write Headers
// writeStream.write(`Title,Link,Date \n`)

request('https://ncov.dxy.cn/ncovh5/view/pneumonia', (error, response, html) => {

  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html)
    //console.log(html)
    // writeStream.write($('.areaBox___3jZkr'))
    writeStream.write(html)

    $('.areaBox___3jZkr').each((i, el) => {
      console.log('i ')
      // writeStream.write(`${html}`)
    })

    console.log('Scraping Done...')
  }
})