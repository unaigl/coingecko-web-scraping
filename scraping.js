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

  // Fetching token addresses from urls
  const addresses = [];

  for (let i = 0; i < 1; i++) {
    await page.goto(urls[i + 38]);

    const tokenAddress = await page.evaluate(() => {
      try {
        const _rawElement = document.querySelectorAll(`[data-address]`);

        let _tokenAddress = [];
        for (let i = 0; i < _rawElement.length; i++) {
          _tokenAddress.push([
            _rawElement[i].getAttribute("data-symbol"),
            _rawElement[i].getAttribute("data-chain-id"),
            _rawElement[i].getAttribute("data-address"),
          ]);
          // _tokenAddress[i].push(_rawElement[i].getAttribute("data-chain-id"));
          // _tokenAddress[i].push(_rawElement[i].getAttribute("data-address"));
        }
        const _elements = [...new Set(_tokenAddress)];

        // Checking arrays with null values to delete them
        const _tokenData = _elements.filter(
          (item) => item[0] !== null && item[1] !== null && item[2] !== null
        );
        // for (let i = 0; i < item.length; i++) {
        //   if (item[i] === null) return false;
        // }
        // return true;

        return _tokenData;
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    await page.goBack();
    addresses.push(tokenAddress);
    console.log(addresses);
  }

  // Closing browser
  await browser.close();
})();
