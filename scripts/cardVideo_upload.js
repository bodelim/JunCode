const fs = require('fs');
const videoList_json_Update = require('./scripts/videoList_json_Update.js'); // 만든 모듈 호출
const videoList_json_Add = require('./scripts/videoList_json_Add.js');
const multer = require("multer");
var requestIp = require('request-ip');

const dataBuffer = fs.readFileSync('videoList.json');
const dataJSON = dataBuffer.toString();
let videoJson_data = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화


function videoCard_upload(upload_videoName){

ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
console.log('=================================================')
console.log('ClientIP: ' + ClientIP + '\n카드형식의 영상 업로드를 요청하였습니다.');

var video_storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, 'public/video/')
    },
    filename: function (req, file, callback){
        callback(null, upload_videoName)
    }
  });
  
  const video_fileFilter = (req, file, callback) =>{
  
    const typeArray = file.mimetype.split('/');
  
    const fileType = typeArray[1]; // 이미지 확장자 추출
    
    //이미지 확장자 구분 검사
    if(fileType == 'mp4' || fileType == 'avi' || fileType == 'mov'){
        callback(null, true)
    }else {
        return callback("카드 영상등록 기능에서는 *.mp4, *.mov, *.avi 파일만 업로드가 가능합니다.");
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
  
  

  console.log('=================================================')


}