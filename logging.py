from pynput.keyboard import Listener
# 이거 안대ㅠ

def on_press(key):
    print(key)

with Listener(on_press=on_press) as listener:
    listener.join()