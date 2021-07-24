var fs = require('fs');
var youtubedl = require('youtube-dl');
var video = youtubedl('https://youtu.be/X2rSbeKq0X0',
    ['--format=18'],
    { cwd: __dirname });

video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
});
``
video.pipe(fs.createWriteStream('testvideo.mp4'));






















































































//도리 왔다감