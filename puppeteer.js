const puppeteer = require('puppeteer');

(async function main(){
    try{
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
        
        // let dataRseult = [
        //     {
        //         'province':{
        //             'name':'myname',
        //             'conffirmed':0,
        //             'deaths':0,
        //             'cures':0
        //         },
        //         'cities':[
        //             {
        //                 'name':'myname',
        //                 'conffirmed':1,
        //                 'deaths':1,
        //                 'cures':1
        //             },
        //             {
        //                 'name':'myname',
        //                 'conffirmed':2,
        //                 'deaths':2,
        //                 'cures':2
        //             }
        //         ]
        //     },
        //     {
        //         'province':{
        //             'name':'myname',
        //             'conffirmed':3,
        //             'deaths':3,
        //             'cures':3
        //         },
        //         'cities':[
        //             {
        //                 'name':'myname',
        //                 'conffirmed':4,
        //                 'deaths':4,
        //                 'cures':4
        //             },
        //             {
        //                 'name':'myname',
        //                 'conffirmed':5,
        //                 'deaths':5,
        //                 'cures':5
        //             }
        //         ]
        //     }
        // ];

        // dataRseult[0].cities[0].name='zz'

        // console.log(dataRseult[0]);

        // let data = {'test':10}

        // for (let i = 0; i < 9; i++) {
        //     data.test = {'val':i}
        //     console.log(data);
        // }

        // let provJson = 
        // {
        //     'province':{
        //         'name':0,
        //         'conffirmed':0,
        //         'deaths':0,
        //         'cures':0
        //     }
        //     'cities':[
        //         {
        //             'name':0,
        //             'conffirmed':0,
        //             'deaths':0,
        //             'cures':0
        //         }
        //     ]
        // }


        let dataRseult = [
            {
                'province':{
                    'name':0,
                    'conffirmed':0,
                    'deaths':0,
                    'cures':0
                },
                'cities':[
                    {
                        'name':0,
                        'conffirmed':0,
                        'deaths':0,
                        'cures':0
                    }
                ]
            }
        ];


        let cities = []









        let ctSectins = 0
        for (const section of sections){

            // let name = await section.$eval('p.subBlock1___j0DGa', tt=>tt.innerText)
            // console.log(name)

            
            // console.log(provincesExp.length + 1)
            //  return false

            const provinces = await section.$$('.fold___xVOZX')
            let nbProv = provinces.length +1
            console.log('provinces = ' + provinces.length)
            console.log('Line | ' + 'Name |' + 'Conffirmed | ' + 'Deaths | ' + 'Cures |' + `\n`)



            const provincesExps = await section.$$('.expand___wz_07')
            for(const provincesExp of provincesExps){
                const citiesEXPEx = await provincesExp.$$('.areaBlock1___3V3UU')
                const citiesEXP = await provincesExp.$$('.areaBlock2___27vn7')
                console.log('province = ' + provincesExps.length)
                console.log('cities = ' + citiesEXP.length)

                 

                for (const citiesPx of citiesEXPEx){
                   
                    name = await citiesPx.$eval('p.subBlock1___j0DGa', n=>n.innerText)

                    conffirmed = await citiesPx.$eval('p.subBlock2___E7-fW', c=>c.innerText)
                    if (conffirmed === '') { conffirmed = '0' }

                    deaths = await citiesPx.$eval('p.subBlock4___ANk6l', d=>d.innerText) 
                        if (deaths === '') { deaths = '0' }

                    cures = await citiesPx.$eval('p.subBlock3___3mcDz', r=>r.innerText)
                    if (cures === '') { cures = '0' }

                    dataRseult[0].province.name= name
                    dataRseult[0].province.conffirmed= conffirmed
                    dataRseult[0].province.deaths= deaths
                    dataRseult[0].province.cures= cures
                    console.log(JSON.stringify(dataRseult, null, 4))

                    return false

                    // dataRseult[1].push(province.name = name)
                    // dataRseult[1].province.conffirmed = conffirmed
                    // dataRseult[1].province.deaths = deaths
                    // dataRseult[1].province.cures = cures
                    console.log(1 + '|' + name + '|' + conffirmed + '|' + deaths + '|' + cures + `\n`)
                }

                let ctexP = 1
                for (const citiesPxz of citiesEXP){
                   
                    name = await citiesPxz.$eval('p.subBlock1___j0DGa', n=>n.innerText)

                    conffirmed = await citiesPxz.$eval('p.subBlock2___E7-fW', c=>c.innerText)
                    if (conffirmed === '') { conffirmed = '0' }

                    deaths = await citiesPxz.$eval('p.subBlock4___ANk6l', d=>d.innerText) 
                        if (deaths === '') { deaths = '0' }

                    cures = await citiesPxz.$eval('p.subBlock3___3mcDz', r=>r.innerText)
                    if (cures === '') { cures = '0' }

                    dataRseult[1].cities[ctexP].name = name
                    dataRseult[1].cities[ctexP].conffirmed = conffirmed
                    dataRseult[1].cities[ctexP].deaths = deaths
                    dataRseult[1].cities[ctexP].cures = cures

                    console.log(ctexP++ + '|' + name + '|' + conffirmed + '|' + deaths + '|' + cures + `\n`)
                }
            }
            
            console.log(dataRseult)

            console.log('=======================================================')

            let pr = 2
            for(const province of provinces){

                const citiesPs = await province.$$('.areaBlock1___3V3UU')
                const cities = await province.$$('.areaBlock2___27vn7')

                console.log('province = ' + pr)
                console.log('cities = ' + cities.length)

                for (const citiesP of citiesPs){
                   
                    name = await citiesP.$eval('p.subBlock1___j0DGa', n=>n.innerText)

                    conffirmed = await citiesP.$eval('p.subBlock2___E7-fW', c=>c.innerText)
                    if (conffirmed === '') { conffirmed = '0' }

                    deaths = await citiesP.$eval('p.subBlock4___ANk6l', d=>d.innerText) 
                        if (deaths === '') { deaths = '0' }

                    cures = await citiesP.$eval('p.subBlock3___3mcDz', r=>r.innerText)
                    if (cures === '') { cures = '0' }

                    console.log(pr + '|' + name + '|' + conffirmed + '|' + deaths + '|' + cures + `\n`)
                }

                let ct=1
                for (const city of cities){

                    let element = await city.$('p.subBlock1___j0DGa')
                    //console.log('element exist = ' + element)
                    // return false
                    // console.log(await city.$('p.subBlock1___j0DGa') === null)

                    
                    if(!(await city.$('p.subBlock1___j0DGa') === null)){
                        name = await city.$eval('p.subBlock1___j0DGa', n=>n.innerText)
                    }
                        
                    
                    let conffirmedSr=false
                    if(!(await city.$('p.subBlock2___E7-fW') === null)){
                        conffirmedSr=true
                        conffirmed = await city.$eval('p.subBlock2___E7-fW', c=>c.innerText)
                        if (conffirmed === '') { conffirmed = '0' }
                    }  

                    
                    let deathsSt = false
                    if(!(await city.$('p.subBlock4___ANk6l') === null)){
                        deathsSt = true
                        deaths = await city.$eval('p.subBlock2___E7-fW', d=>d.innerText)
                        if (deaths === '') { deaths = '0' }
                    }  

                    
                    let curesSt = false
                    if(!(await city.$('p.subBlock3___3mcDz') === null)){
                        curesSt = true
                        cures = await city.$eval('p.subBlock2___E7-fW', r=>r.innerText)
                        if (cures === '') { cures = '0' }
                    }  
                    if(curesSt && deathsSt && conffirmedSr){
                        console.log(ct++ + '|' + name + '|' + conffirmed + '|' + deaths + '|' + cures + `\n`)
                    }
                }
                pr++
                console.log('=======================================================')
            }
        }
        // console.log(section.length);

    }catch(e){
        console.log('our error', e);
    }
})();
