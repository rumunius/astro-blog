---
title: 使用Python和百度对外共享的TTS接口实现文本转语音
description: '时效性文章'
publishDate: 2020-07-08 22:09
tags:
  - 技术
  - 软件
  - python
  - 爬虫
---

### 起因

近日，一个朋友给了我一张神奇的二维码：
![Alt](https://i-blog.csdnimg.cn/blog_migrate/689939b63097e4210c823d0a8efdf770.png#pic_center)
我扫了一下，进入了[这个链接](https://tts.baidu.com/text2audio?tex=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%EF%BC%81&cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0)：
`https://tts.baidu.com/text2audio?tex=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%EF%BC%81&cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0`
页面里就是一个mp3文件：
![Alt](https://i-blog.csdnimg.cn/blog_migrate/7b2084a0eec1f4b314d75f5dd393a66d.png)
自动播放了一个“你好世界”的语音
***
看到`tts.baidu.com`这种奇怪的字眼和熟悉的**URL编码**，我本能地去把编码解码出来，不用说你们也知道，解码结果就是`你好世界！`
![Alt](https://i-blog.csdnimg.cn/blog_migrate/74c65b022e0f4b625ae1a47d8b3cd601.png)
那么，一切基本就真相大白了：

> **`https://tts.baidu.com/text2audio`使用URL的参数来进行文本转语音，返回mp3文件。**

### 经过

再经过一段时间的摸索，我基本找到了参数的规律：

 - `tex`参数：要转为语音的文本内容
 - `spd`参数：朗读速度，取值范围 [1,9]
 - `lan`参数：语言码，取值及其含义如下表：
   
|语言码| 含义 |
|--|--|
|ZH|普通话|
|EN|美式英语|
|UK|英式英语|
|CTE|粤语|
- `per`参数：音色码，取值及其实际音色如下表（只有普通话有音色码，其他语音只有一种标准音音色，标准音音色的音色码可以设为0）：

|音色码| 实际音色 |
|--|--|
|0|标准女音|
|1|标准男音|
|3|斯文男音|
|4|小萌萌|
|5|知性女音|
|6|老教授|
|8|葛平音|
|9|播音员|
|10|京腔|
|11|温柔大叔|


> *使用表格以外的音色码或语言码可能会报错*

其他参数作用未知，暂时设定朋友给的二维码里的值

<font color=#dddddd>~~这些音色码的“实际音色”其实都是我自己靠耳朵听出来，自己给那个音色起的名字。。。~~</font>

<font color=#dddddd>~~希望有大神可以找出剩下参数的作用或是更多的音色码/语言码~~</font>
### 代码
于是，我使用Python的**requests库**写了一个方便调用百度TTS语音功能的程序：
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
#import os


def TTS(text, speed, lan, per):
    """普通话-音色：
          标准女音
          标准男音
          斯文男音
          小萌萌
          知性女音
          老教授
          葛平音
          播音员
          京腔
          温柔大叔
       英式英语-音色：
          标准音
       美式英语-音色：
          标准音
       粤语-音色：
          标准音
    """
    convertTable = {                       #建立易读文本和音色码/语言码的关系表
        '中文': ('ZH', {
            '标准女音': 0,
            '标准男音': 1,
            '斯文男音': 3,
            '小萌萌': 4,
            '知性女音': 5,
            '老教授': 6,
            '葛平音': 8,
            '播音员': 9,
            '京腔': 10,
            '温柔大叔': 11
        }),
        '英式英语': ('UK', {
            '标准音': 0
        }),
        '美式英语': ('EN', {
            '标准音': 0
        }),
        '粤语': ('CTE', {
            '标准音': 0
        })
    }
    data = {
        'tex': text,
        'spd': speed,
        'lan': convertTable[lan][0],
        'per': convertTable[lan][1][per],
        'ctp': 1,
        'cuid': 'baike',
        'ie': 'UTF-8',
        'pdt': 301,
        'vol': 9,
        'rate': 32
    }
    result = requests.get('https://tts.baidu.com/text2audio', params=data)
    try:
        result.json()
    except:
        return result.content
    else:
        raise ValueError


if __name__ == '__main__':
    try:
        bindata = TTS('''测试一下，你好世界！''', 5, '中文', '小萌萌')
    except:
        print('Error')
    else:
        with open('result.mp3', 'wb+') as f:
            f.write(bindata)            #在同级目录写入为mp3文件
        #os.startfile('result.mp3')     #自动运行生成的mp3

```