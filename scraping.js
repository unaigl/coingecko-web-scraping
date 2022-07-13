const puppeteer = require("puppeteer");

(async () => {
  // Opening a browser at coingecko website
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  // Evaluating page's DOM elements and extracting data
  const { urls, rawTickers } = await page.evaluate(() => {
    // Extracting DOM elemets to an array // Contains href and ticker
    const _rawUrls = document.querySelectorAll(".coin-name a");

    // Looping to extract and filter data
    const _urls = [];
    const _tickers = [];
    for (let i = 0; i < _rawUrls.length; i++) {
      let _url = _rawUrls[i].href;
      _urls.push(_url);

      // Taking the "ticker" of each token/coin
      _tickers.push(_rawUrls[i].firstChild.nodeValue);
    }

    return { _urls, _tickers };
  });

  // Filtering and cleaning data
  // Deleting duplicated data from urls
  const setUrls = [...new Set(urls)];
  // Cleaning our tickers data array
  let finalTickers = [];
  let tokenNames = [];
  // Extracting only the tickers we've inside our array
  // @dev - Be aware of rawTickers value, because is defined by an async method
  for (let i = 0; i < rawTickers.length; i++) {
    let str = rawTickers[i].trim();
    // console.log(str);
    if (str === str.toUpperCase()) {
      finalTickers.push(rawTickers[i]);
    } else {
      tokenNames.push(rawTickers[i]);
    }
  }

  // console.log("aa", finalTickers);
  // console.log("ccc", tokenNames);
  // console.log("ccc", setUrls);

  // Obteniendo el contrato
  for (let i = 0; i < 3; i++) {
    await page.goto(webUrls[i]);

    try {
      const _rawElemet = document.querySelectorAll(
        `[data-symbol="${finalTickers[i]}"]`
      );
      console.log(_rawElemet);
    } catch (error) {
      console.log("Has not an address, is a Coin");
    }

    await page.goBack();
  }

  await browser.close();
})();
