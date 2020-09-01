const http = require('http');

const url = 'http://10.128.0.62:9200/_security/_authenticate';
const method = 'GET';
const agent = new http.Agent({
	keepAlive: true,
	keepAliveMsecs: 1000,
	maxSockets: Infinity,
	maxFreeSockets: 256,
});
const requestListener = function (inReq, inRes) {
  const request = http.request(url, {
	agent,
        method,
        headers: { 
            'Authorization': 'Basic ZWxhc3RpYzpjaGFuZ2VtZQ==',
        },
        rejectUnauthorized: false
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

