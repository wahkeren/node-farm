const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js');

//SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

dataObj.forEach((el, i) => (el['slug'] = slugs[i]));
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    //=== 1º solution option using findIndex() ====
    // const id = dataObj.findIndex((el) => el.slug === query.slug);
    const slugName = dataObj.map((el) => el.slug === query.id);
    const id = slugName.indexOf(true);
    const product = dataObj[id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // Product page
    // } else if (pathname.includes('/product')) {
    //   res.writeHead(200, { 'Content-type': 'text/html' });
    //   const slug = pathname.replace('/product/', '');
    //   const product = dataObj.filter((element) => {
    //     return element.slug === slug;
    //   })[0];
    //   const output = replaceTemplate(tempProduct, product);
    //   res.end(output);

    // } else if (pathname === '/product') {
    //   res.writeHead(200, {
    //     'Content-type': 'text/html',
    //   });
    //  const product = dataObj[query.id];
    // const output = replaceTemplate(tempProduct, product);
    // res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// // console.log(textOut);
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File Written!');

// Non-blocking, asynchronous was
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);

//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('your file has been written');
//       });
//     });
//   });
//   // console.log(data);
// });
// console.log('will read file');
