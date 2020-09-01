const fs = require('fs');
const https = require('https');

const url = 'https://elasticsearch:9200/_security/_authenticate';

const certs = {
	ca: fs.readFileSync('certs/ca/ca.crt'),
	cert: fs.readFileSync('certs/kibana/kibana.crt'),
	key: fs.readFileSync('certs/kibana/kibana.key')
};

const agent = new https.Agent({
	keepAlive: true,
	keepAliveMsecs: 1000,
	maxSockets: Infinity,
	maxFreeSockets: 256,
});

const requestListener = function (incomingRequest, incomingResponse) {
  doSomething(1);
  const outgoingRequest = https.request(url, {
	ca: certs.ca,
	agent,
        method: 'GET',
        headers: { 
            'Authorization': incomingRequest.headers.authorization,
        },
    }, function (outgoingResponse) {
	let data = '';
	outgoingResponse.on('data', (chunk) => data += chunk);
        outgoingResponse.on('end', () => {
	    doSomething(1);
	    incomingResponse.writeHead(outgoingResponse.statusCode);
	    incomingResponse.end(data);
        });
    });

   outgoingRequest.on('error', (error) => {
	   console.error(error);
	   incomingResponse.writeHead(500);
	   incomingResponse.end(error.message);
    });
   outgoingRequest.end();
}

const server = https.createServer({
  cert: certs.cert,
  key: certs.key,
}, requestListener);
server.listen(3000, '0.0.0.0', 50000);

function doSomething(ms) {
  const start = new Date();
  while(new Date() - start < ms) {}
};
