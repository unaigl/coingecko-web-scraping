const fs = require("fs");
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

  for (let i = 0; i < urls.length; i++) {
    await page.goto(urls[i + 38]);

    const tokenAddress = await page.evaluate(() => {
      var _rawElement;
      try {
        _rawElement = document.querySelectorAll(`[data-address]`);
      } catch (error) {
        console.log(error);
        return null;
      }

      // We will run code inside puppeteer's opened browser
      // Extracting raw data
      let _tokenAddress = [];
      for (let i = 0; i < _rawElement.length; i++) {
        _tokenAddress.push([
          _rawElement[i].getAttribute("data-symbol"),
          _rawElement[i].getAttribute("data-chain-id"),
          _rawElement[i].getAttribute("data-address"),
          _rawElement[i].getAttribute("data-decimals"),
          /* ADD more INFO to json */
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
      tokenObject[`${_tokenData[0][0]}`] = {
        symbol: `${_tokenData[0][0]}`,
      };

      // Dividing in an array of chains where the token is deployed
      const chains = [];
      for (let i = 0; i < _tokenData.length; i++) {
        chains.push(_tokenData[i][1]);
      }
      // Dividing in an array of addresses of the token
      const tokenAddressPerChain = [];
      for (let i = 0; i < _tokenData.length; i++) {
        tokenAddressPerChain.push(_tokenData[i][2]);
      }
      // Dividing in an array token`s decimals
      const tokenDecimals = [];
      for (let i = 0; i < _tokenData.length; i++) {
        tokenDecimals.push(_tokenData[i][3]);
      }
      // Adding data to final object, overrides duplicated data
      for (let i = 0; i < chains.length; i++) {
        tokenObject[`${_tokenData[0][0]}`][`${chains[i]}`] = {
          address: [`${tokenAddressPerChain[i]}`],
          decimals: [`${tokenDecimals[i]}`],
          /* ADD more INFO to json*/
        };
      }

      return tokenObject;
    });

    await page.goBack();
    addresses.push(tokenAddress);
    console.log(addresses);
  }
  // creating JSON file
  fs.writeFileSync("json/TokenAddresses.json", JSON.stringify(addresses));

  // Closing browser
  await browser.close();
})();
