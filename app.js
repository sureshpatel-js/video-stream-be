const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");
const cors = require('cors')
const PORT = process.env.PORT || 8000;
// var whitelist = ['http://127.0.0.1:3000/']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }
app.use(cors());
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        return cb(null, "videos");
    },
    filename: function (req, file, cb) {
        return cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });



app.post("/video-upload", upload.single("file"), (req, res) => {
    return res.status(201).json({
        status: "success"
    });
});

app.get("/video-play", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./videos/00_install_vs_code.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});