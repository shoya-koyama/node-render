'use strict';
const http = require('node:http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>Questions</h1>' +
            '<a href="/enquetes">Questions です。</a>' +
            '</body></html>');
        } else if (req.url === '/enquetes') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>Questions</h1><ul>' +
            '<li><a href="/enquetes/meat">肉一兆</a></li>' +
            '<li><a href="/enquetes/ika">イカ二貫</a></li>' +
            '<li><a href="/enquetes/susuru">ラー抜き</a></li>' +
            '</ul></body></html>');
        } else if (req.url === '/enquetes/meat') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '肉',
              secondItem: '一兆円'
            })
          );
        } else if (req.url === '/enquetes/ika') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: 'イカ二貫',
              secondItem: '胃薬'
            })
          );
        } else if (req.url === '/enquetes/susuru') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: 'riku',
            secondItem: 'TV'
          }));
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}様は${answer.get('favorite')}にvoteしました`;
            console.info(`[${now}] ${body}`);
            res.write(`<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
