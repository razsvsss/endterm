const http = require("http");
var fs = require('fs');

var path = require('path');

const hostname = "127.0.0.1";
const port = 3000;

const check = path => {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    } catch (err) {
        return false;
    }

}

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        fs.readFile("./index.html", "UTF-8", function (err, html) {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Internal error with a response code 500");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    } else if (req.url === "/about") {
        fs.readFile("./about.html", "UTF-8", function (err, html) {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Internal error with a response code 500");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    } else if (req.url.match(/\.css$/gi)) {
        var cssPath = path.join(__dirname, req.url);
        if (check(cssPath)) {
            var fileStream = fs.createReadStream(cssPath, "UTF-8");
            res.writeHead(200, { "Content-Type": "text/css" });
            fileStream.pipe(res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else if (req.url.match(/\.js$/gi)) {
        var jsPath = path.join(__dirname, req.url);
        if (check(jsPath)) {
            var fileStream = fs.createReadStream(jsPath, "UTF-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            fileStream.pipe(res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else if (req.url.match(/\.jpg$/gi)) {
        var imgPath = path.join(__dirname, req.url);
        if (check(imgPath)) {
            var fileStream = fs.createReadStream(imgPath);
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            fileStream.pipe(res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else if (req.url.startsWith("/img/gallery/")) {
        var imgPath = path.join(__dirname, req.url + ".jpg");
        if (check(imgPath)) {
            var fileStream = fs.createReadStream(imgPath);
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            fileStream.pipe(res);
        } else {
            res.writeHead(302, {
                'Location': '/error.html'
            });
            res.end();
        }
    } else if (req.url.startsWith("/video/")) {
        var videoName = req.url + ".mp4";
        videoName = videoName.split("/").slice(-1)[0];
        var videoPath = path.join(__dirname, "video", "students", videoName);
        console.log(videoPath);
        if (check(videoPath)) {
            var fileStream = fs.createReadStream(videoPath);
            res.writeHead(200, { "Content-Type": "video/mp4" });
            fileStream.pipe(res);
        } else {
            res.writeHead(302, {
                'Location': '/error.html'
            });
            res.end();
        }
    } else if (req.url === "/error.html") {
        fs.readFile("./error.html", "UTF-8", function (err, html) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(html);
        });
    }
    else {
        res.writeHead(302, {
            'Location': '/error.html'
        });
        res.end();
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

