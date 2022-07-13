// d-lg-none font-bold tw-w-12

// far tw-text-sm tw-ml-2 align-middle hover:tw-bg-gray-200 dark:hover:tw-bg-gray-500 fa-far fa-clone

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.coingecko.com/es");

  const enlaces = await page.evaluate(() => {
    const rawElements = document.querySelectorAll(".coin-name a");
    const urls = [];
    for (let i = 0; i < rawElements.length; i++) {
      urls.push(rawElements[i].href);
    }

    const setted = [...new Set(urls)];
    // const elements = [... new Set(rawElements.href)]
    //     const elements = [];
    //     rawElements.forEach((e, i) => {
    //       //   if (!i % 2) {
    //       //     elements.push(e.href);
    //       //   }

    //       if (e[i].href !== e[i + 1].href) {
    //         elements.push(e.href);
    //       }
    //     });
    //     const links = [];
    //     for (let element of elements) {
    //       links.push(element);
    //     }
    return setted;
  });
  //   console.log(enlaces.length);
  console.log(enlaces);

  await page.waitForFileChooser(1000);
  //   await page.goBack();

  await browser.close();
})();
