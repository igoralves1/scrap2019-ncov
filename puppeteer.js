const puppeteer = require('puppeteer')
const fs = require('fs')

main();

async function main() {
  const dtms = Date.now()
  const dt = new Date().toISOString()

  const writeStream = fs.createWriteStream('./data/' + dt + '.csv')

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
    //
    // p.subBlock2___E7-fW (Existing confirmed diagnosis)
    // p.subBlock5___2EkOU title___2d1_B (Cumulative diagnosis)
    // p.subBlock4___ANk6l title___2d1_B (deaths)
    // p.subBlock3___3mcDz title___2d1_B (cure)

    let name = ''
    let conffirmed = ''
    let cumulative = ''
    let deaths = ''
    
    let cures = ''

    let strResult = 'Name,Dt,ExistingConfirmedDiagnosis,CumulativeDiagnosis,Deaths,Cures,DateMS\n'
    let nb = 1

    for (const section of sections) {
      if (nb === 1) {
        const provincesExps = await section.$$('.expand___wz_07')

        for (const provincesExp of provincesExps) {
            const citiesEXPEx = await provincesExp.$$('.areaBlock1___3V3UU')
            const citiesEXP = await provincesExp.$$('.areaBlock2___27vn7')

            for (const citiesPx of citiesEXPEx) {
            name = await citiesPx.$eval('p.subBlock1___j0DGa', n => n.innerText)

            conffirmed = await citiesPx.$eval('p.subBlock2___E7-fW', c => c.innerText)
            if (conffirmed === '') { conffirmed = '0' }

            cumulative = await citiesPx.$eval('p.subBlock5___2EkOU', y => y.innerText)
            if (cumulative === '') { cumulative = '0' }

            deaths = await citiesPx.$eval('p.subBlock4___ANk6l', d => d.innerText) 
            if (deaths === '') { deaths = '0' }

            cures = await citiesPx.$eval('p.subBlock3___3mcDz', r => r.innerText)
            if (cures === '') { cures = '0' }

            strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
            }

            for (const citiesPxz of citiesEXP) {
            name = await citiesPxz.$eval('p.subBlock1___j0DGa', n => n.innerText)

            conffirmed = await citiesPxz.$eval('p.subBlock2___E7-fW', c => c.innerText)
            if (conffirmed === '') { conffirmed = '0' }

            cumulative = await citiesPxz.$eval('p.subBlock5___2EkOU', y => y.innerText)
            if (cumulative === '') { cumulative = '0' }

            deaths = await citiesPxz.$eval('p.subBlock4___ANk6l', d => d.innerText)
            if (deaths === '') { deaths = '0' }

            cures = await citiesPxz.$eval('p.subBlock3___3mcDz', r => r.innerText)
            if (cures === '') { cures = '0' }

            strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
            }
        }

        const provinces = await section.$$('.fold___xVOZX')
        for (const province of provinces) {
            const citiesPs = await province.$$('.areaBlock1___3V3UU')
            const cities = await province.$$('.areaBlock2___27vn7')

            for (const citiesP of citiesPs) {
            name = await citiesP.$eval('p.subBlock1___j0DGa', n => n.innerText)

            conffirmed = await citiesP.$eval('p.subBlock2___E7-fW', c => c.innerText)
            if (conffirmed === '') { conffirmed = '0' }

            cumulative = await citiesP.$eval('p.subBlock5___2EkOU', y => y.innerText)
            if (cumulative === '') { cumulative = '0' }
            
            deaths = await citiesP.$eval('p.subBlock4___ANk6l', d => d.innerText)
            if (deaths === '') { deaths = '0' }

            cures = await citiesP.$eval('p.subBlock3___3mcDz', r => r.innerText)
            if (cures === '') { cures = '0' }

            strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
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

                let cumulativeSr = false
                if (!(await city.$('p.subBlock5___2EkOU') === null)) {
                    cumulativeSr = true
                    cumulative = await city.$eval('p.subBlock5___2EkOU', y => y.innerText)
                    if (cumulative === '') { cumulative = '0' }
                }
            
                let deathsSt = false
                if (!(await city.$('p.subBlock4___ANk6l') === null)) {
                    deathsSt = true
                    deaths = await city.$eval('p.subBlock4___ANk6l', d => d.innerText)
                    if (deaths === '') { deaths = '0' }
                }

                let curesSt = false
                if (!(await city.$('p.subBlock3___3mcDz') === null)) {
                    curesSt = true
                    cures = await city.$eval('p.subBlock3___3mcDz', r => r.innerText)
                    if (cures === '') { cures = '0' }
                }
                if (curesSt && cumulativeSr && deathsSt && conffirmedSr) {
                    strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
                }
            }
        }

      }
      if (nb === 2) {
        const divs = await section.$$('div')
        let nbDiv = 1
        for (const div of divs) {
            if (nbDiv === 2) {
                name = await div.$eval('p.subBlock1___j0DGa', n => n.innerText)

                conffirmed = await div.$eval('p.subBlock2___E7-fW', c => c.innerText)
                if (conffirmed === '') { conffirmed = '0' }

                cumulative = await div.$eval('p.subBlock5___2EkOU', y => y.innerText)
                if (cumulative === '') { cumulative = '0' }

                deaths = await div.$eval('p.subBlock4___ANk6l', d => d.innerText)
                if (deaths === '') { deaths = '0' }

                cures = await div.$eval('p.subBlock3___3mcDz', r => r.innerText)
                if (cures === '') { cures = '0' }

                strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
            }
            if (nbDiv > 2) {
                const ab1s = await div.$$('.areaBlock1___3V3UU')
                const ab2s = await div.$$('.areaBlock2___27vn7')

                for (const ab1 of ab1s) {
                    name = await ab1.$eval('p.subBlock1___j0DGa', n => n.innerText)

                    conffirmed = await ab1.$eval('p.subBlock2___E7-fW', c => c.innerText)
                    if (conffirmed === '') { conffirmed = '0' }

                    cumulative = await ab1.$eval('p.subBlock5___2EkOU', y => y.innerText)
                    if (cumulative === '') { cumulative = '0' }

                    deaths = await ab1.$eval('p.subBlock4___ANk6l', d => d.innerText)
                    if (deaths === '') { deaths = '0' }

                    cures = await ab1.$eval('p.subBlock3___3mcDz', r => r.innerText)
                    if (cures === '') { cures = '0' }

                    strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
                }

                for (const ab2 of ab2s) {
                    name = await ab2.$eval('p.subBlock1___j0DGa', n => n.innerText)

                    conffirmed = await ab2.$eval('p.subBlock2___E7-fW', c => c.innerText)
                    if (conffirmed === '') { conffirmed = '0' }
                    
                    cumulative = await ab2.$eval('p.subBlock5___2EkOU', y => y.innerText)
                    if (cumulative === '') { cumulative = '0' }

                    deaths = await ab2.$eval('p.subBlock4___ANk6l', d => d.innerText)
                    if (deaths === '') { deaths = '0' }

                    cures = await ab2.$eval('p.subBlock3___3mcDz', r => r.innerText)
                    if (cures === '') { cures = '0' }

                    strResult = strResult + name + ',' + dt + ',' + conffirmed + ',' + cumulative + ',' + deaths + ',' + cures + ',' + dtms + '\n'
                }
            }
            nbDiv++
        }
      }
    nb++
    }
    await writeStream.write(strResult)
    console.log(strResult)
  } catch (e) {
    console.log('our error', e)
  }

  setTimeout(main, 1000 * 60 * 30)
}
