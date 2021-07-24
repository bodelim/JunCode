import time
import random

class Sex:
    def __init__(self):
        self.tools = []
        self.timemillis = 0

    def push(self, what, to):
        print("[ "+what + "(을)를 " + to +"에 밀어넣음 ]")
        if len(self.tools)>0:
            print("...with " + " and ".join(self.tools))

    def setTime(self, millis):
        self.timemillis = millis

    def start(self):
        print("[ 야스하는 중... ]")
        time.sleep(self.timemillis/1000)

    def setTools(self, tools):
        self.tools = tools

    def rest(self, millis):
        print("[ 쉬는 중... ]")
        time.sleep(millis/1000)

    def motelOut(self):
        print("[ 역시 재창이는 병신 입니다. ]")

    def seuiggi(self):
        print("[ 재창이는 모쏠 아다입니다. ]")

sex = Sex()
count = 0
girlIsUpset = False
toolsLeft = ['Vibrator', 'Anal Plug', '']
def POWERSEX(name: str = "재창이(모쏠 아다 병신)", partner: str = "이름", manIsHyunja: bool = True, tools: list = ['Vibrator', 'Anal Plug']):
    global count
    global girlIsUpset

    while True:
        sex.push("Penis", "Pussy") # 자지로 밀다 PP
        sex.setTime(3000) #ms
        sex.start()
        if count > 5:
            sex.seuiggi()
            count = 0
        count += 1
        if girlIsUpset == True:
            print('{}: \"야(아) 너무 빨리 쌌잖아\"'.format(partner))
            print('{}: \"그.. 다시세워볼까?\"'.format(name))
            print('{}: 자기야 나 부랄이 띵해'.format(partner))
            sex.motelOut()
            print('{}: \"{}야(아) 다신 만나지말자\"'.format(partner, name))
            break
        if manIsHyunja == True:
            print('{}: 하..싸버렸어'.format(name))
            print('{}: 좀만 쉬자'.format(name))
            sex.rest(10000) #ms
            sex.setTools(tools)
            print('{}: 자기야 도구로 가버리게 해줄게'.format(name))
            manIsHyunja = False
        else:
            rand = random.randrange(1,10)
            manIsHyunja = True
            if rand >= 9:
                girlIsUpset = True

POWERSEX()
print("재창이 모쏠 아다")