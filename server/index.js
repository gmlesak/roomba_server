var dorita980 = require('dorita980');
var http = require('http');
var url = require('url');

const blid = process.env.ROOMBA_BLID;
const password = process.env.ROOMBA_PASSWORD;
const HOST = '0.0.0.0';
const PORT = '6565';

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        var _req = url.parse(req.url, true);
        switch (_req.pathname) {
            case '/status':
                if (_req.query.ip) {
                    try {
                        var myRobotViaLocal = new dorita980.Local(BLID, PASSWORD, _req.query.ip);
                        myRobotViaLocal.getRobotState(['batPct']).then((state) => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.write(JSON.stringify(state))
                            res.end();
                            myRobotViaLocal.end();
                        }).catch((err) => {
                            console.error(err);
                        });
                    } catch(e) {
                        res.writeHead(500);
                        res.end();
                    }
                } else {
                    dorita980.getRobotIP((ierr, ip) => {
                        if (ierr) return console.log('error looking for robot IP');  
                        try {
                            var myRobotViaLocal = new dorita980.Local(BLID, PASSWORD, ip);
                            myRobotViaLocal.getRobotState(['batPct']).then((state) => {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.write(JSON.stringify(state));
                                res.end();
                                myRobotViaLocal.end();
                            }).catch((err) => {
                                console.error(err);
                            });
                        } catch(e) {
                            res.writeHead(500);
                            res.end();
                        }              
                    });
                }
                break;
            default:
                res.writeHead(404);
                res.end();
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Roomba API server running on http://${HOST}:${PORT}`)
})
