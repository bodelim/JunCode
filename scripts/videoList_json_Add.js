const fs = require('fs')

function videoList_json_Add(selectArea, value){
    try{
        console.log('value: ' + value.videoName)
        const dataBuffer = fs.readFileSync('videoList.json');
        const dataJSON = dataBuffer.toString();
        let data = JSON.parse(dataJSON);
        //value = eval(value); // 받은 문자열을 변수화
        //value = JSON.parse(value);
        console.log('value: ' + value)
        data[selectArea].push(value); // json Add.
        data['amount'] = (data['amount'] + 1);
        data['lastId'] = (data['lastId'] + 1);
        fs.writeFileSync('videoList.json', JSON.stringify(data, null, 2))
        }catch(err) {
          console.error(err);
        }
}
module.exports = videoList_json_Add; // 현재 코드를 모듈화