const fs = require('fs');
const http = require('http');
const https = require('https');

const url = 'https://elasticsearch:9200/_security/_authenticate';
const ca = fs.readFileSync('certs/ca/ca.crt');
const method = 'GET';
const agent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 1000,
	maxSockets: Infinity,
	maxFreeSockets: 256,
});
const requestListener = function (inReq, inRes) {
  const request = http.request(url, {
	ca,
	agent,
        method,
        headers: { 
            'Authorization': inReq.headers.authorization,
        },
        rejectUnauthorized: true
    }, function (response) {
	let data = '';
	response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
	    inRes.writeHead(response.statusCode);
	    inRes.end(data);
        });
    });

   request.on('error', (error) => {
	   console.error(error);
	   inRes.writeHead(500);
	   inRes.end(error.message);
    });
   request.end();

}

const server = http.createServer(requestListener);
server.listen(3000, '0.0.0.0', 50000);

