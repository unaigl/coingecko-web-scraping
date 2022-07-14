const puppeteer = require("puppeteer");

(async () => {
  // Opening a browser at coingecko website
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  // Evaluating page's DOM elements and extracting data // Console logs inside "evaluate" will print in puppeteer's opened browser
  const data = await page.evaluate(() => {
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

    return { urls: _urls, rawTickers: _tickers };
  });

  const urls = data.urls;
  const rawTickers = data.rawTickers;

  // Filtering and cleaning data
  // Deleting duplicated data from urls
  const setUrls = [...new Set(urls)];
  // Cleaning our tickers data array
  var finalTickers = [];
  var tokenNames = [];
  // Extracting only the tickers we've inside our array
  // @dev - Be aware of rawTickers.length value, because is defined by an async method
  for (let i = 0; i < rawTickers.length; i++) {
    let str = rawTickers[i].trim();
    // console.log(str);
    if (str === str.toUpperCase()) {
      finalTickers.push(rawTickers[i]);
    } else {
      tokenNames.push(rawTickers[i]);
    }
  }
  // finalTickers, tokenNames, setUrls

  // Obteniendo el contrato
  const addresses = [];

  for (let i = 0; i < 1; i++) {
    await page.goto(setUrls[i + 38]);
    // console.log(finalTickers[i + 38]);

    const yes = await page.evaluate(() => {
      // const ticker = `[data-symbol="${finalTickers[i + 38]}"]`; //
      // const ticker = `[data-chain-id="1"]`;
      // const ticker = ".cursor-pointer";
      // const ticker = "[data-address]";

      // rodo: problema con async
      const _rawTicker = document.querySelectorAll(`[data-address]`);
      // const _rawTicker = document.querySelector(ticker);
      // const _rawAddress = document.querySelectorAll(address);
      let aa = [];
      aa.push(_rawTicker[0].getAttribute("data-symbol"));
      for (let i = 0; i < _rawTicker.length; i++) {
        aa.push(_rawTicker[i].getAttribute("data-chain-id"));
        aa.push(_rawTicker[i].getAttribute("data-address"));
      }
      return aa;
    });

    await page.goBack();
    addresses.push(yes);
    console.log(addresses);
  }

  // Closing browser
  await browser.close();
})();

// todo: no es necesario sacar los tickers ni los names. si ES NECESARIO tal vez
