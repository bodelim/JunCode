const http = require('http');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const net = require('net');
//const dos = require('./dosFlooding.js')
var requestIp = require('request-ip');
const url = require('url');
var querystring = require('querystring'); 
const fs = require('fs')
const multer = require("multer");

const app = express();
const server = http.createServer(app);
const port = 3001 || process.env.port;

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.set('views', './views');

let videos = {
  '1': '파이_사과문',
  '2': '도쿄올림픽_픽토그램',
  '3-1': '윤이버셜_1',
  '3-2': '윤이버셜_2',
  '3-3': '윤이버셜_3'
};

const dataBuffer = fs.readFileSync('videoList.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)

console.log(data["videos"][0].id)


app.get('/', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\n서버 트래픽 발생');
    console.log('=================================')
  res.render('index');
})


// 파일 업로드 관련기능 구현


// 이미지 업로드
var img_storage = multer.diskStorage({
  destination: function (req, file, callback){
      callback(null, 'public/img/')
  },
  filename: function (req, file, callback){
      callback(null, file.originalname)
  }
});

const img_fileFilter = (req, file, callback) =>{

  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1]; // 이미지 확장자 추출
  
  //이미지 확장자 구분 검사
  if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
      callback(null, true)
  }else {
      return callback("*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.");
  }
}

var img_upload = multer({
  storage: img_storage,
  limits: {
      files: 1, //파일개수제한 1개
      fileSize: 256 * 256 * 256 //파일크기제한 256MB
  },
  fileFilter : img_fileFilter // 이미지 업로드 필터링 설정
});

app.route('/process/photo').post(img_upload.array('photo', 1), function(req, res){
  console.log('/process/photo 호출됨');
  
  try{
      var files = req.files;
      
      console.dir('#-----업로드된 첫번째 파일 정보-----#')
      console.dir(req.files[0]);
      console.dir('#------#')
      
      var originalname = '', filename = '', mimetype = '', size = 0;
      
      if(Array.isArray(files)){
          console.log("배열 파일 갯수: %d", files.length);
          
          for(var i=0; i<files.length; i++){
              originalname = files[i].originalname;
              filename = files[i].filename;
              mimetype = files[i].mimetype;
              size = files[i].size;
          }
      }
      
      console.log("현재 파일 정보: " + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
      
      res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<h1>업로드 성공</h1>');
      res.write('<hr />');
      res.write('<p>원본 파일이름: ' + originalname + '-> 저장 파일이름: ' + filename + '</p>');
      res.write('<p>MIMETYPE: ' + mimetype + '</p>');
      res.write('<p>SIZE: ' + size + '</p>');
      res.end();
  } catch(err) {
      console.dir(err.stack);
  }
});


// 영상 업로드

var video_storage = multer.diskStorage({
  destination: function (req, file, callback){
      callback(null, 'public/video/')
  },
  filename: function (req, file, callback){
      callback(null, file.originalname)
  }
});

const video_fileFilter = (req, file, callback) =>{

  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1]; // 이미지 확장자 추출
  
  //이미지 확장자 구분 검사
  if(fileType == 'mp4' || fileType == 'avi' || fileType == 'mov'){
      callback(null, true)
  }else {
      return callback("*.mp4, *.mov, *.avi 파일만 업로드가 가능합니다.");
  }
}

var video_upload = multer({
  storage: video_storage,
  limits: {
      files: 1, //파일개수제한 1개
      fileSize: 256 * 256 * 256 //파일크기제한 256MB
  },
  fileFilter : video_fileFilter // 이미지 업로드 필터링 설정
});

app.route('/process/video').post(video_upload.array('video', 1), function(req, res){
  console.log('/process/video 호출됨');
  
  try{
      var files = req.files;
      
      console.dir('#-----업로드된 첫번째 파일 정보-----#')
      console.dir(req.files[0]);
      console.dir('#------#')
      
      var originalname = '', filename = '', mimetype = '', size = 0;
      
      if(Array.isArray(files)){
          console.log("배열 파일 갯수: %d", files.length);
          
          for(var i=0; i<files.length; i++){
              originalname = files[i].originalname;
              filename = files[i].filename;
              mimetype = files[i].mimetype;
              size = files[i].size;
          }
      }
      
      console.log("현재 파일 정보: " + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
      
      res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<h1>업로드 성공</h1>');
      res.write('<hr />');
      res.write('<p>원본 파일이름: ' + originalname + '-> 저장 파일이름: ' + filename + '</p>');
      res.write('<p>MIMETYPE: ' + mimetype + '</p>');
      res.write('<p>SIZE: ' + size + '</p>');
      res.end();
  } catch(err) {
      console.dir(err.stack);
  }
});


app.get('/videoplayer', (req, res) => {
    VideoID = req.query.id; // 요청받은 비디오 아이디
    ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
    selectVideo = videos[VideoID]; // 최종 송출 될 영상 이름
    console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\nvideoID: ' + VideoID);
    console.log('=================================')
    res.render('videoplayer.ejs' , {'called_videoName' : selectVideo});
  })

app.get('/img_upload', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
  console.log('ClientIP: ' + ClientIP + '\n접근장소: /uploadimg');
  console.log('=================================')
  res.render('img_upload.ejs');
})

app.get('/video_upload', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
  console.log('ClientIP: ' + ClientIP + '\n접근장소: /uploadimg');
  console.log('=================================')
  res.render('video_upload.ejs');
})

server.listen(port, () => {
  console.log('서버가 열렸음.');
});