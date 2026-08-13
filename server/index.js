var dorita980 = require('dorita980');
var http = require('http');
var url = require('url');

const ROOMBA_IP = process.env.ROOMBA_IP;
const BLID = process.env.ROOMBA_BLID;
const PASSWORD = process.env.ROOMBA_PASSWORD;

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
            if (!ROOMBA_IP) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "ROOMBA_IP not set" }));
            }

            try {
                const myRobotViaLocal = new dorita980.Local(BLID, PASSWORD, ROOMBA_IP);

                // Request full state (Tidbyt app requires name, phase, etc.)
                const state = await myRobotViaLocal.getRobotState();

                myRobotViaLocal.end();

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(state));
            } catch (err) {
                console.error("Roomba error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to reach Roomba" }));
            }
            break;

        default:
            res.writeHead(404);
            res.end();
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Roomba API server running on http://${HOST}:${PORT}`);
});
