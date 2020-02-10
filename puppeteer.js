const puppeteer = require('puppeteer')
const fs = require('fs')
const dt = Date.now()
const writeStream = fs.createWriteStream(dt + '.csv')

async function main() {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    // console.log(await page.evaluate('navigator.userAgent'))
    page.setUserAgent(await page.evaluate('navigator.userAgent'))

    await page.goto('https://ncov.dxy.cn/ncovh5/view/pneumonia')
    // await page.waitForNavigation()

    await page.waitForSelector('.areaBox___3jZkr')
    const sections = await page.$$('.areaBox___3jZkr')

    // Top level divareaBox___3jZkr (there are 2 of them)
    // div.expand___wz_07 or div.fold___xVOZX (Father-> contain 1 son div.areaBlock1___3V3UU(Province) or 0 or many sons div.areaBlock2___27vn7(city) )
    // div.areaBlock1___3V3UU(Province) or div.areaBlock2___27vn7(city)
    // p.subBlock1___j0DGa (name (Province or city))
    // p.subBlock2___E7-fW (conffirmed)
    // p.subBlock4___ANk6l (deaths)
    // p.subBlock3___3mcDz (cure)

    let name = ''
    let deaths = ''
    let conffirmed = ''
    let cures = ''

    let strResult = 'Name,Conffirmed,Deaths,Cures\n'

    for (const section of sections) {
      const provinces = await section.$$('.fold___xVOZX')

      const provincesExps = await section.$$('.expand___wz_07')
      for (const provincesExp of provincesExps) {
        const citiesEXPEx = await provincesExp.$$('.areaBlock1___3V3UU')
        const citiesEXP = await provincesExp.$$('.areaBlock2___27vn7')

        for (const citiesPx of citiesEXPEx) {
          name = await citiesPx.$eval('p.subBlock1___j0DGa', n => n.innerText)

          conffirmed = await citiesPx.$eval('p.subBlock2___E7-fW', c => c.innerText)
          if (conffirmed === '') { conffirmed = '0' }

          deaths = await citiesPx.$eval('p.subBlock4___ANk6l', d => d.innerText) 
          if (deaths === '') { deaths = '0' }

          cures = await citiesPx.$eval('p.subBlock3___3mcDz', r => r.innerText)
          if (cures === '') { cures = '0' }

          strResult = strResult + name + ',' + conffirmed + ',' + deaths + ',' + cures + '\n'
        }

        for (const citiesPxz of citiesEXP) {
          name = await citiesPxz.$eval('p.subBlock1___j0DGa', n => n.innerText)
          conffirmed = await citiesPxz.$eval('p.subBlock2___E7-fW', c => c.innerText)
          if (conffirmed === '') { conffirmed = '0' }

          deaths = await citiesPxz.$eval('p.subBlock4___ANk6l', d => d.innerText)
          if (deaths === '') { deaths = '0' }
          cures = await citiesPxz.$eval('p.subBlock3___3mcDz', r => r.innerText)
          if (cures === '') { cures = '0' }
          strResult = strResult + name + ',' + conffirmed + ',' + deaths + ',' + cures + '\n'
        }
      }

      for (const province of provinces) {
        const citiesPs = await province.$$('.areaBlock1___3V3UU')
        const cities = await province.$$('.areaBlock2___27vn7')

        for (const citiesP of citiesPs) {
          name = await citiesP.$eval('p.subBlock1___j0DGa', n => n.innerText)
          conffirmed = await citiesP.$eval('p.subBlock2___E7-fW', c => c.innerText)
          if (conffirmed === '') { conffirmed = '0' }
          deaths = await citiesP.$eval('p.subBlock4___ANk6l', d => d.innerText)
          if (deaths === '') { deaths = '0' }
          cures = await citiesP.$eval('p.subBlock3___3mcDz', r => r.innerText)
          if (cures === '') { cures = '0' }
          strResult = strResult + name + ',' + conffirmed + ',' + deaths + ',' + cures + '\n'
        }

        for (const city of cities) {
          let element = await city.$('p.subBlock1___j0DGa')

          if (!(await city.$('p.subBlock1___j0DGa') === null)) {
            name = await city.$eval('p.subBlock1___j0DGa', n => n.innerText)
          }

          let conffirmedSr = false
          if (!(await city.$('p.subBlock2___E7-fW') === null)) {
            conffirmedSr = true
            conffirmed = await city.$eval('p.subBlock2___E7-fW', c => c.innerText)
            if (conffirmed === '') { conffirmed = '0' }
          }
          let deathsSt = false
          if (!(await city.$('p.subBlock4___ANk6l') === null)) {
            deathsSt = true
            deaths = await city.$eval('p.subBlock2___E7-fW', d => d.innerText)
            if (deaths === '') { deaths = '0' }
          }

          let curesSt = false
          if (!(await city.$('p.subBlock3___3mcDz') === null)) {
            curesSt = true
            cures = await city.$eval('p.subBlock2___E7-fW', r => r.innerText)
            if (cures === '') { cures = '0' }
          }
          if (curesSt && deathsSt && conffirmedSr) {
            strResult = strResult + name + ',' + conffirmed + ',' + deaths + ',' + cures + '\n'
          }
        }
      }
    }
    writeStream.write(strResult)
    console.log(strResult)
  } catch (e) {
    console.log('our error', e)
  }
}

(async function run () {
  setTimeout(main, 3000)
})()
