const fs = require('fs')

function videoList_json_delete(selectArea, selectIndex, videoName){

    const dataBuffer = fs.readFileSync('videoList.json');
    const dataJSON = dataBuffer.toString();
    let data = JSON.parse(dataJSON);

    try{

    data[selectArea].splice(selectIndex, 1);

    data['amount'] = data['amount'] - 1;

    console.log(JSON.stringify(data,null,2));

    fs.unlink(`public/video/${videoName}`, (err) => err ?  
    console.log(err) : console.log(`${videoName} (을)를 정상적으로 삭제했습니다`));

    fs.writeFileSync('videoList.json', JSON.stringify(data, null, 2))
        }catch(err) {
          console.error(err);
        }

}

module.exports = videoList_json_delete;