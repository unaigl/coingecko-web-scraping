const puppeteer = require("puppeteer");

(async () => {
  // Opening a browser at coingecko website
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  // Evaluating page's DOM elements and extracting data
  const { urls, tickers } = await page.evaluate(() => {
    // Extracting DOM elemets to an array // Contains href and ticker
    const rawUrls = document.querySelectorAll(".coin-name a");

    // Looping to extract and filter data
    const urls = [];
    const tickers = [];
    for (let i = 0; i < rawUrls.length; i++) {
      let _url = rawUrls[i].href;
      urls.push(_url);

      // Taking the "ticker" of each token/coin
      tickers.push(rawUrls[i].firstChild.nodeValue);
    }

    return { urls, tickers };
  });

  // Filtering and cleaning data
  // Deleting duplicated data from urls
  const setUrls = [...new Set(urls)];
  // Cleaning our tickers data array
  let finalTickers = [];
  let tokenNames = [];
  // Extracting only the tickers we've inside our array
  for (let i = 0; i < tickers.length; i++) {
    let str = tickers[i].trim();
    // console.log(str);
    if (str === str.toUpperCase()) {
      finalTickers.push(tickers[i]);
    } else {
      tokenNames.push(tickers[i]);
    }
  }
  console.log("aa", finalTickers);
  console.log("ccc", tokenNames);

  // Obteniendo el contrato
  // for (let i = 0; i < /* webUrls.length */ 3; i++) {
  //   await page.goto(webUrls[i]);

  //   try {
  //     await page.get;
  //   } catch (error) {
  //     console.log("Has not an address, is a Coin");
  //   }

  //   await page.goBack();
  // }

  await browser.close();
})();
