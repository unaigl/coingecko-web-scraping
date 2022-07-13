const puppeteer = require("puppeteer");

(async () => {
  // Opening a browser at coingecko page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  // Evaluating page DOM elements and extracting data
  const { urls, tickers } = await page.evaluate(() => {
    // Extracting DOM elemets to an array // Contains href and ticker
    const rawUrls = document.querySelectorAll(".coin-name a");

    // Looping to extract and filter data
    const urls = [];
    const tickers = [];
    for (let i = 0; i < rawUrls.length; i++) {
      let _url = rawUrls[i].href;
      urls.push(_url);

      // Taking the "ticker and name" of each token/coin
      tickers.push(rawUrls[i].firstChild.nodeValue);
    }
    // Deleting duplicated data
    const setUrls = [...new Set(urls)];

    const finalTickers = tickers.filter((ticker) => {
      let _finalTickers = [];

      let _splitted = ticker.split("");
      let _counter = 0;
      let _tick = "";
      for (let i = 0; i < _splitted.length; i++) {
        if (_splitted[i] === _splitted[i].toUpperCase()) {
          _counter++;
          _tick += _splitted[i];
        }
      }
      if (_counter >= 2) {
        _finalTickers.push(_tick);
        return _finalTickers;
      }
      return false;
    });

    return { setUrls, finalTickers };
  });

  // console.log(webUrls.length);
  // console.log(webUrls);
  // console.log(names);
  console.log(tickers);

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
