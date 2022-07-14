const puppeteer = require("puppeteer");

(async () => {
  // Opening a browser at coingecko website
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  // Evaluating page's DOM elements and extracting data // Console logs inside "evaluate" will print in puppeteer's opened browser
  const duplicatesUrls = await page.evaluate(() => {
    // Extracting DOM elemets to an array // Contains href and ticker
    const _rawUrls = document.querySelectorAll(".coin-name a");

    // Looping to extract and filter data
    const _duplicatesUrls = [];
    for (let i = 0; i < _rawUrls.length; i++) {
      let _url = _rawUrls[i].href;
      _duplicatesUrls.push(_url);
    }

    return _duplicatesUrls;
  });

  // Deleting duplicated data from urls
  const urls = [...new Set(duplicatesUrls)];

  /* 
      SECOND
      PART
  */

  // Fetching token addresses from urls
  const addresses = [];

  for (let i = 0; i < 2; i++) {
    await page.goto(urls[i + 38]);

    const tokenAddress = await page.evaluate(() => {
      var _rawElement;
      try {
        _rawElement = document.querySelectorAll(`[data-address]`);
      } catch (error) {
        console.log(error);
        return null;
      }

      // We will operate inside puppeteer's opened browser due to async functions
      // Extracting raw data
      let _tokenAddress = [];
      for (let i = 0; i < _rawElement.length; i++) {
        _tokenAddress.push([
          _rawElement[i].getAttribute("data-symbol"),
          _rawElement[i].getAttribute("data-chain-id"),
          _rawElement[i].getAttribute("data-address"),
        ]);
      }
      // Deleting data
      const _elements = [...new Set(_tokenAddress)];

      // Checking duplicated arrays with null values to delete them
      const _tokenData = _elements.filter(
        (item) => item[0] !== null && item[1] !== null && item[2] !== null
      );

      // Deleting duplicated data while constructing final data obkect
      const tokenObject = {};
      // un objeto con su ticker para cada token
      tokenObject._tokenData[0][0] = {};

      // dentro del objeto, tenemos las propiedades de symbol, chainId_1, chainId_137...
      // estoy creando un array solo con chains
      const chains = [];
      for (let i = 0; i < _tokenData.length; i++) {
        chains.push(_tokenData[i][1]);
      }
      // estoy creando un array solo con los addresses
      const tokenAddressPerChain = [];
      for (let i = 0; i < _tokenData.length; i++) {
        tokenAddressPerChain.push(_tokenData[i][2]);
      }

      // Integrando los datos en el objeto
      for (let i = 0; i < chains.length; i++) {
        tokenObject._tokenData[0][0].chains[i] = {
          address: tokenAddressPerChain[i],
        };
      }

      return _tokenData;
    });

    await page.goBack();
    addresses.push(tokenAddress);
    console.log(addresses);
  }

  // Closing browser
  await browser.close();
})();
