var dorita980 = require('dorita980');
var http = require('http');
var url = require('url');

const BLID = process.env.ROOMBA_BLID;
const PASSWORD = process.env.ROOMBA_PASSWORD;   // your cloud token
const HOST = '0.0.0.0';
const PORT = '6565';

const server = http.createServer(async (req, res) => {
    if (req.method !== "GET") {
        res.writeHead(404);
        return res.end();
    }

    const _req = url.parse(req.url, true);

    switch (_req.pathname) {
        case "/status":
            try {
                const myRobotViaCloud = new dorita980.Cloud(BLID, PASSWORD);

                const state = await myRobotViaCloud.getRobotState();

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(state));
            } catch (err) {
                console.error("Roomba cloud error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to reach Roomba cloud API" }));
            }
            break;

        default:
            res.writeHead(404);
            res.end();
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Roomba Cloud API server running on http://${HOST}:${PORT}`);
});
