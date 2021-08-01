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
var bodyParser = require('body-parser');


const videoList_json_Update = require('./scripts/videoList_json_Update.js');
const videoList_json_Add = require('./scripts/videoList_json_Add.js');
const videoList_json_delete = require('./scripts/videoList_json_delete');

let dataBuffer = fs.readFileSync('videoList.json');
let dataJSON = dataBuffer.toString();
let videoJson_data = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화
let set_videoName = "defult";

const app = express();
const server = http.createServer(app);
const port = 3001 || process.env.port;

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.set('views', './views');

app.use(bodyParser.urlencoded({extend : false}));

video_storage = multer.diskStorage({
  destination: function (req, file, callback){
      callback(null, 'public/video/')
  },
  filename: function (req, file, callback){
      callback(null, file.originalname)
  }
});

video_fileFilter = (req, file, callback) =>{

  typeArray = file.mimetype.split('/');

  fileType = typeArray[1]; // 이미지 확장자 추출
  
  //이미지 확장자 구분 검사
  if(fileType == 'mp4' || fileType == 'avi' || fileType == 'mov'){
      callback(null, true)
  }else {
      return callback("*.mp4, *.mov, *.avi 파일만 업로드가 가능합니다.");
  }
}
video_upload = multer({
  storage: video_storage,
  limits: {
      files: 1, //파일개수제한 1개
      fileSize: 256 * 1024 * 2014 //파일크기제한 256MB
  },
  fileFilter : video_fileFilter // 이미지 업로드 필터링 설정
});



// var video_storage = multer.diskStorage({
//   destination: function (req, file, callback){
//       callback(null, 'public/video/')
//   },
//   filename: function (req, file, callback){
//       callback(null, file.originalname)
//   }
// });

// var video_fileFilter = (req, file, callback) =>{

//   var typeArray = file.mimetype.split('/');

//   var fileType = typeArray[1]; // 이미지 확장자 추출
  
//   //이미지 확장자 구분 검사
//   if(fileType == 'mp4' || fileType == 'avi' || fileType == 'mov'){
//       callback(null, true)
//   }else {
//       return callback("*.mp4, *.mov, *.avi 파일만 업로드가 가능합니다.");
//   }
// }

// var video_upload = multer({
//   storage: video_storage,
//   limits: {
//       files: 1, //파일개수제한 1개
//       fileSize: 256 * 256 * 256 //파일크기제한 256MB
//   },
//   fileFilter : video_fileFilter // 이미지 업로드 필터링 설정
// });


//videoList_json_Update('videos', 0, "id", 1);
//videoList_json_Add('videos', '{"id": 6,"videoName": "윤이버셜_3","uploader": "보들","uploadTime": "*"}');

app.get('/', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\nServer Connection Occurred');
    console.log('=================================')
  res.render('index', {"videoList_json": videoJson_data});
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



// 카드형식 영상업로드.
app.route('/cardUpload/video').post(video_upload.array('video', 1), function(req, res) {

  console.log('/cardUpload/video was called.');
  console.log('유저가 설정한 영상이름: ' + req.body.set_videoName);  
  set_videoName = req.body.set_videoName;

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

      // videoList.json 수정
      videoList_json_Add('videos', {"id": (videoJson_data['lastId']+1) ,"videoName": filename, "displayName": set_videoName, "thumbnail": "img/thumbnail/이미지준비중.png","uploader": "보들","uploadTime": "*"})

      // json 업데이트
      dataBuffer = fs.readFileSync('videoList.json');
      dataJSON = dataBuffer.toString();
      videoJson_data = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화


  } catch(err) {
      console.dir(err.stack);
  }
});

// 썸네일 업로드 설정
var thumbnail_img_storage = multer.diskStorage({
  destination: function (req, file, callback){
      callback(null, 'public/img/thumbnail')
  },
  filename: function (req, file, callback){
      callback(null, file.originalname)
  }
});

const thumbnail_img_fileFilter = (req, file, callback) =>{

  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1]; // 이미지 확장자 추출
  
  //이미지 확장자 구분 검사
  if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
      callback(null, true)
  }else {
      return callback("*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.");
  }
}

var thumbnail_img_upload = multer({
  storage: thumbnail_img_storage,
  limits: {
      files: 1, //파일개수제한 1개
      fileSize: 256 * 256 * 256 //파일크기제한 256MB
  },
  fileFilter : thumbnail_img_fileFilter // 이미지 업로드 필터링 설정
});



app.route('/thumbnail/upload').post(thumbnail_img_upload.array('photo', 1), function(req, res){
  console.log('/thumbnail/upload 호출됨');
  videoIndex = req.body.index;
  videoID = req.body.id;
  selectVideo = videoJson_data['videos'][videoIndex].videoName; // 최종 송출 될 영상 이름
  console.log('videoIndex: ' + videoIndex)
  console.log('videoID:' + videoID)

  files = req.files;
  
  videoList_json_Update('videos', videoIndex, 'thumbnail', 'img/thumbnail/' + files[0].filename)

  // json 업데이트
  dataBuffer = fs.readFileSync('videoList.json');
  dataJSON = dataBuffer.toString();
  videoJson_data = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화

  res.redirect('http://bodle.kro.kr:'+port+'/videoplayer?id='+videoID);

});


app.get('/videoplayer', (req, res) => {
    ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
    VideoID = req.query.id; // 요청받은 비디오 아이디
    for(i=0; i<videoJson_data['amount']; i++){
      if(videoJson_data['videos'][i].id == VideoID){
        videoIndex = i;
        break;
      }// json에서 적절한 영상을 찾으면 탈출
    }
    selectVideo = videoJson_data['videos'][videoIndex].videoName; // 최종 송출 될 영상 이름
    displayName = videoJson_data['videos'][videoIndex].displayName; // 영상을 업로드한 사람이 설정한 영상이름
    console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\nvideoID: ' + VideoID);
    console.log('=================================')
    res.render('videoplayer.ejs' , {'called_videoName' : selectVideo, 'called_displayName': displayName, 'called_videoID': VideoID, 'called_videoIndex': videoIndex});
  })

app.get('/card_thumbnail_upload', (req, res) => {
    ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
    VideoID = req.query.id; // 요청받은 비디오 아이디
    videoIndex = req.query.index; // 요청받은 비디오의 위치
    console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\nvideoID: ' + VideoID);
    console.log('=================================')
    res.render('card_thumbnail_upload.ejs' , {'called_videoIndex' : videoIndex, 'called_videoID': VideoID});
  })

app.get('/card_video_delete', (req, res) => {
  lientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  VideoID = req.query.id; // 요청받은 비디오 아이디
  videoIndex = req.query.index; // 요청받은 비디오의 위치
  delete_videoName = videoJson_data['videos'][videoIndex].videoName; // 삭제시킬 동영상 파일명

  videoList_json_delete('videos', videoIndex, delete_videoName);

  // json 업데이트
  dataBuffer = fs.readFileSync('videoList.json');
  dataJSON = dataBuffer.toString();
  videoJson_data = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화

  res.redirect('http://bodle.kro.kr:' + port);
  
})

app.get('/img_upload', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
  console.log('ClientIP: ' + ClientIP + '\n접근장소: /img_upload');
  console.log('=================================')
  res.render('img_upload.ejs');
})

app.get('/video_upload', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
  console.log('ClientIP: ' + ClientIP + '\n접근장소: /video_upload');
  console.log('=================================')
  res.render('video_upload.ejs');
})

app.get('/cardVideo_upload', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
  console.log('ClientIP: ' + ClientIP + '\n접근장소: /cardVideo_upload');
  console.log('=================================')
  res.render('cardVideo_upload.ejs');
})



server.listen(port, () => {
  console.log('서버가 열렸음.');
});
