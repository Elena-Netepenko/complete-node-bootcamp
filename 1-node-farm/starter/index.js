const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

//////////////////////////////////////////////////////////////////////////////////////////////////
// FILES

// // blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('Text written');

// // non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// })

// // read the file start.txt
// // using output of previous call, read and print read-this.txt
// // upon completion of previous call, 
// //     read and print append.txt
// //     write output of 2nd and 3rd calls into final.txt and print 'Your file has been written'

// fs.readFile('./txttt/start.txt', 'utf-8', (err, data1) => {
//     if (err) {
//         console.log('ERROR!');
//         return;
//     }

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
//                 console.log('Your file has been written');
//             })
//         })
//     })
// })

// console.log('Will read file.');

//////////////////////////////////////////////////////////////////////////////////////////////////
// SERVER

function replaceTemplate(temp, product) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
// read the data from data.json
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    // implementing routing
    console.log(req.url);
    // parsing query string from url
    console.log(url.parse(req.url, true));
    const pathName = req.url;

    // OVERVIEW PAGE
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    }

    // PRODUCT PAGE
    else if (pathName === '/product') res.end('This is PRODUCT');
    
    // API PAGE
    else if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data);
    }

    // NOT FOUND
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening for requests on port 8000');
})



