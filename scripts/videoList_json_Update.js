const fs = require('fs')

function videoList_json_Update(selectArea, selectIndex, selectKey, value){

/*
인자 값 메모

ex)
  selectArea == "videos"
  selectIndex == 0
  selectKey == "id"
  value: 기존의 값을 value로 변경

  data[selectArea][selectIndex][selectKey] = value; <=> data["videos"][0]["id"] = value;


*/

try{

    const dataBuffer = fs.readFileSync('videoList.json');
    const dataJSON = dataBuffer.toString();
    let data = JSON.parse(dataJSON);
    selectIndex = eval(selectIndex);// 받은 문자열을 변수화
    data[selectArea][selectIndex][selectKey] = value; // json Update.
    console.log('selectArea: '+ data[selectArea][selectIndex][selectKey])
    fs.writeFileSync('videoList.json', JSON.stringify(data, null, 2))
    }catch(err) {
      console.error(err);
    }
  }

module.exports = videoList_json_Update; // 현재 코드를 모듈화