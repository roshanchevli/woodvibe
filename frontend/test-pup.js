const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.url().includes('/api/')) {
        console.log('API RESPONSE:', response.url(), response.status());
    }
  });

  await page.goto('http://localhost:4200/product', { waitUntil: 'networkidle0' });

  const html = await page.evaluate(() => {
    return document.querySelector('.product-grid') ? document.querySelector('.product-grid').innerHTML : 'NO GRID';
  });

  console.log('HTML CONTENT:', html.substring(0, 1000));
  await browser.close();
})();
