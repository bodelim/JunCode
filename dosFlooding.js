try{
    
    const Packet = class {
      constructor(buffer,size){
        this.buffer = buffer || Buffer.alloc(size || Packet.static.STANDARD_PACKET_SIZE);
        this.offset = 0;
      }
  
      get(index){
        return this.buffer.get(index || this.offset++);
      }
  
      getBuffer(){
        return this.buffer;
      }
    }
  
    Packet.static = Object.freeze({
      STANDARD_PACKET_SIZE : 0xff
    })
  
    const MessagePacket = class extends Packet {
      constructor(msgStr){
        this.msgStr = msgStr || "NO MESSAGE";
        super(Buffer.from(this.msgStr));
      }
    }
    
    const os = require("os");
    const cluster = require("cluster");
  
    const cpuInfo = os.cpus();
    cluster.schedulingPolicy = cluster.SCHED_NONE;
  
    if(cluster.isMaster){
        console.log("node process in " + cpuInfo[0]);
        for(let a = 0; a < cpuInfo.length; a++){
            cluster.fork();
            console.log('')
        }
    }
    else{

        process.on('message', function(message) {
            const net = require("net");
            const content = new MessagePacket("샌즈어택".repeat(30));

            try{
                while(true){

                }
            }
            catch(e){
                console.log(e);
            }

            console.log('워커가 마스터에게 받은 메시지 : ' + message);

        });
    
        //마스터에게 메시지 보내기
        process.send(process.pid + '에서 워커 생성되었습니다.');
    }
    
  
  }catch(__ignore){
      
  }
  