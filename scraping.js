import fs from "fs";
import puppeteer from "puppeteer";

(async () => {
  /* 
      FETCHING WEB URLS
  */
  // Opening a browser at coingecko website
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es?page=6"); //https://www.coingecko.com/es?page=2

  // Evaluating page's DOM elements and extracting data
  const duplicatedUrls = await page.evaluate(() => {
    // Extracting DOM elemets to an array // Contains href and ticker
    const _rawUrls = document.querySelectorAll(".coin-name a");

    // Looping to extract and filter data
    const _duplicatedUrls = [];
    for (let i = 0; i < _rawUrls.length; i++) {
      let _url = _rawUrls[i].href;
      _duplicatedUrls.push(_url);
    }

    return _duplicatedUrls;
  });

  // Deleting duplicated data from urls
  const urls = [...new Set(duplicatedUrls)];

  /* 
      LOOPING IN EACH URL 
      DATA FETCHING LOGIC
      FILTERING AND STRUCTURING DATA
  */

  // Fetching token addresses from urls, "addresses" will be final array
  const addresses = [];

  // todo: tratar de sacar del for la mayor parte del codigo. Dividirlo en...
  // We create a loop that will wrap the logic that will take care of getting the data, filtering it,
  // structuring it, and returning it to an array. and return it to an array
  for (let i = 0; i < urls.length; i++) {
    await page.goto(urls[i]);

    const tokenAddress = await page.evaluate(() => {
      /* 
        DATA FETCHING LOGIC
      */
      var _rawElement;
      try {
        _rawElement = document.querySelectorAll(`[data-address]`);
      } catch (error) {
        // Most coins, also have "data-address" atribute in DOM element
        console.log("Is a coin, has not an address"); // Logs are only visible in pupperteer opened browser
        return undefined;
      }
      // If is a coin, we don't search for an address, "_rawElement" will be false
      if (_rawElement) {
        // We will run code inside puppeteer's opened browser
        // Extracting raw data
        let _tokenAddress = [];

        for (let i = 0; i < _rawElement.length; i++) {
          _tokenAddress.push([
            _rawElement[i].getAttribute("data-symbol"),
            _rawElement[i].getAttribute("data-chain-id"),
            _rawElement[i].getAttribute("data-address"),
            _rawElement[i].getAttribute("data-decimals"),
            /* search for more INFO in DOM element */
          ]);
        }
        /* 
          FILTERING DATA
        */

        // As mentioned before, we need to guarantee to return "undefined" if it is a Coin
        // 2 checks
        // Comparing "data-address" if starts with "0x"
        let isToken = false;
        // Checking if there is a "data-chain-id" value // In near future, maybe we'll need more filters
        let isChain = false;
        for (let i = 0; i < _rawElement.length; i++) {
          const addr = _rawElement[i]
            .getAttribute("data-address") // hasta en los tokens, puede veinr uno con un string
            .substring(0, 2);
          if (addr === "0x") {
            isToken = true;
            console.log("is a token"); // Logs are only visible in pupperteer opened browser
          }
          const chainTest = _rawElement[i].getAttribute("data-chain-id");
          if (chainTest) {
            isChain = true;
          }
        }
        if (!isToken || !isChain) return undefined;

        // Cleaning data
        const _elements = [...new Set(_tokenAddress)];

        // Checking duplicated arrays with null values to delete them
        const _tokenData = _elements.filter(
          (item) => item[0] !== null && item[1] !== null && item[2] !== null
        );

        /* 
          STRUCTURING DATA
        */
        // Deleting duplicated data while constructing final data object
        const tokenObject = {};
        // un objeto con su ticker para cada token
        tokenObject[`${_tokenData[0][0]}`] = {
          symbol: `${_tokenData[0][0]}`,
        };

        // Dividing in an array of chains where the token is deployed
        const chains = [];
        // Dividing in an array of addresses of the token
        const tokenAddressPerChain = [];
        // Dividing in an array token`s decimals
        const tokenDecimals = [];
        for (let i = 0; i < _tokenData.length; i++) {
          chains.push(_tokenData[i][1]);
          tokenAddressPerChain.push(_tokenData[i][2]);
          tokenDecimals.push(_tokenData[i][3]);
        }
        // Adding data to final object, overrides duplicated data
        for (let i = 0; i < chains.length; i++) {
          tokenObject[`${_tokenData[0][0]}`][`${chains[i]}`] = {
            address: `${tokenAddressPerChain[i]}`,
            decimals: `${tokenDecimals[i]}`,
            /* ADD more INFO to json*/
          };
        }

        return tokenObject;
      } else return undefined;
    });
    // THE LOOP ENDS HERE

    await page.goBack();
    if (tokenAddress) {
      addresses.push(tokenAddress);
    }
  }
  // console.log(addresses); // Logs are only visible in pupperteer opened browser
  // creating JSON file
  fs.writeFileSync("json/printTokenAddresses.json", JSON.stringify(addresses));

  // Closing browser
  await browser.close();
})();
