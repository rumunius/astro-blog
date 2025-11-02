---
title: arduinoNano实现2048小游戏
description: '这一篇是硬件介绍，源码解析在另一篇。'
publishDate: 2021-08-17 15:40
tags:
  - 技术
  - 软件
  - 硬件
  - 单片机
  - Arduino
---
# 效果

先看看制作完成的效果吧！

![IMG_20210818_155610.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/f5838ea32ce13a38c1dee2d0116ad03e.jpeg)

![IMG_20210818_155355.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/f6f678e75daa00df6df3eab8002b3c61.jpeg)

![IMG_20210818_155521.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/6206fab64c21778cfdca6885fbb69a60.jpeg)

![new](https://i-blog.csdnimg.cn/blog_migrate/b971bbbc52dd4c1cda2875cea149ae6e.jpeg)

![IMG_20210818_155511.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/e5381c2d9c7bddb44f1c478e97a84d8b.jpeg)

# 一、元器件清单

|            元器件            | 数量 |
| :--------------------------: | :--: |
| LCD12864（驱动芯片为ST7920） |  1   |
|         arduino nano         |  1   |
|           长面包板           |  1   |
|           短面包板           |  1   |
|           10K电阻            |  4   |
|           轻触按钮           |  4   |
|          100nF电容           |  4   |
|          10K电位器           |  1   |
|             导线             | 若干 |
|          聪慧的大脑          |  1   |
|           灵巧的手           |  2   |

# 二、制作教程

## 搭建电路

首先按照原理图搭建电路：

![image-20210817150718789](https://i-blog.csdnimg.cn/blog_migrate/cb42baea9a2405a47e58610ec53afee7.png)

此处的10K电位器用于调节LCD12864的对比度，10K定值电阻用于下拉，100nF电容用于消抖。

LCD12864上的E、R/W和RS管脚与arduinoSPI接口的对应关系如下：

| LCD12864 |               ArduinoSPI接口               |
| :------: | :----------------------------------------: |
|    E     | SCK（对于arduino nano和uno来说，接口为13） |
|   R/W    |           MOSI（同上，接口为11）           |
|    RS    |   CS（这个可自由指定，此处选择10号接口）   |

搭建完成后（未理线，较丑）：

![QQ图片20210817153908](https://i-blog.csdnimg.cn/blog_migrate/ddf8ab89667d4ef95d37c9eff0df7e6d.jpeg)

## 烧录程序

新建名为`arduino2048`的文件夹，

在其中新建两个文件，写入以下内容：

### arduino2048.ino

```cpp
#include <time.h>
#include <U8g2lib.h>

//U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/U8X8_PIN_NONE);  //OLED

U8G2_ST7920_128X64_F_HW_SPI u8g2(U8G2_R2, /* CS=*/10, /* reset=*/12); //LCD12864
#include "Number.h"

/*Pins of Buttons*/
#define Up 4
#define Down 5
#define Left 6
#define Right 7

//#define CHEAT  //开局生成两个1024以作弊
//#define TEST_MODE //开启数字块显示测试

inline int getRand(int a, int b)
{
  return rand() % (b - a + 1) + a;
}

enum DIRECTION
{
  LEFT,
  RIGHT,
  UP,
  DOWN
};
class board
{
  private:
    int map[4][4];
    long score;
    using PtrToMemberFunc = bool (board::*)(int);                                                   //指向成员函数的指针
    PtrToMemberFunc Moves[4] = {&board::LeftOne, &board::RightOne, &board::UpOne, &board::DownOne}; //把四个方向移动的方法组织成一个数组
    bool changed;

  public:
    void init();
    void summon(bool noFour = false);
    bool isOver();
    bool isWon();
    bool isChanged() {
      return changed;
    }
    int getScore() {
      return score;
    }
    bool LeftOne(int ro);
    bool RightOne(int ro);
    bool UpOne(int ro);
    bool DownOne(int ro);
    void move(DIRECTION di);
    void updateDisplay();
    void setNum(int a, int b);
};

void board::init()
{

  memset(map, 0, sizeof(map));
  summon();
  summon(true);
#ifdef CHEAT
  map[0][0] = 1024;
  map[1][0] = 1024;
#endif
#ifdef TEST_MODE
  map[0][0] = 2;
  map[0][1] = 4;
  map[0][2] = 8;
  map[0][3] = 16;
  map[1][0] = 32;
  map[1][1] = 64;
  map[1][2] = 128;
  map[1][3] = 256;
  map[2][0] = 512;
  map[2][1] = 1024;
  map[2][2] = 2048;
#endif
  changed = true;
  score = 0;
}
void board::summon(bool noFour)
{
  struct block
  {
    int x;
    int y;
  } blanks[16];
  memset(blanks, 0, sizeof(blanks));

  int ptr = 0;
  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 4; ++j)
      if (map[i][j] == 0) //遍历棋盘，寻找空格，放入队列
        blanks[ptr++] = {i, j};
  block &sele = blanks[getRand(0, ptr - 1)]; //从队列里随机选择一个空格
  if (noFour)
    map[sele.x][sele.y] = 2;
  else
    map[sele.x][sele.y] = getRand(1, 10) > 3 ? 2 : 4;
}

bool board::LeftOne(int ro)
{
  bool fail = true;
  int c = 0;
  while (c < 4)
  {
    int nextc = c + 1;
    while (nextc < 4 && map[ro][nextc] == 0)
      nextc++;
    if (nextc >= 4)
      break;
    if (map[ro][c] == 0)
    {
      fail = false;
      map[ro][c] = map[ro][nextc];
      map[ro][nextc] = 0;
      continue;
    }
    else if (map[ro][c] == map[ro][nextc])
    {
      fail = false;
      map[ro][c] *= 2;
      score += map[ro][c];
      map[ro][nextc] = 0;
    }
    ++c;
  }
  return fail;
}
bool board::RightOne(int ro)
{
  bool fail = true;
  int c = 3;
  while (c >= 0)
  {
    int nextc = c - 1;
    while (nextc >= 0 && map[ro][nextc] == 0)
      nextc--;
    if (nextc < 0)
      break;
    if (map[ro][c] == 0)
    {
      fail = false;
      map[ro][c] = map[ro][nextc];
      map[ro][nextc] = 0;
      continue;
    }
    else if (map[ro][c] == map[ro][nextc])
    {
      fail = false;
      map[ro][c] *= 2;
      score += map[ro][c];
      map[ro][nextc] = 0;
    }
    --c;
  }
  return fail;
}
bool board::UpOne(int ro)
{
  bool fail = true;

  int c = 0;
  while (c < 4)
  {
    int nextc = c + 1;
    while (nextc < 4 && map[nextc][ro] == 0)
      nextc++;
    if (nextc >= 4)
      break;
    if (map[c][ro] == 0)
    {
      fail = false;
      map[c][ro] = map[nextc][ro];
      map[nextc][ro] = 0;
      continue;
    }
    else if (map[c][ro] == map[nextc][ro])
    {
      fail = false;
      map[c][ro] *= 2;
      score += map[c][ro];
      map[nextc][ro] = 0;
    }
    ++c;
  }
  return fail;
}
bool board::DownOne(int ro)
{
  bool fail = true;

  int c = 3;
  while (c >= 0)
  {
    int nextc = c - 1;
    while (nextc >= 0 && map[nextc][ro] == 0)
      nextc--;
    if (nextc < 0)
      break;
    if (map[c][ro] == 0)
    {
      fail = false;
      map[c][ro] = map[nextc][ro];
      map[nextc][ro] = 0;
      continue;
    }
    else if (map[c][ro] == map[nextc][ro])
    {
      fail = false;
      map[c][ro] *= 2;
      score += map[c][ro];
      map[nextc][ro] = 0;
    }
    --c;
  }
  return fail;
}
void board::move(DIRECTION di)
{
  bool fail = true;
  for (int i = 0; i < 4; ++i)
  {
    bool tmp = (this->*Moves[di])(i);
    fail &= tmp;
  }
  changed = !fail;
  if (!fail)
    summon();
}
bool board::isOver()
{
  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 4; ++j)
    {
      if (map[i][j] == 0)
        return false;
      if (j < 3 && map[i][j] == map[i][j + 1])
      {
        return false;
      }
      if (i < 3 && map[i][j] == map[i + 1][j])
      {
        return false;
      }
    }
  return true;
}
bool board::isWon()
{
  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 4; ++j)
    {
      if (map[i][j] >= 2048)
        return true;
    }
  return false;
}

void board::updateDisplay()
{
  u8g2.clearBuffer();

  u8g2.drawFrame(0, 0, 61, 61);
  u8g2.drawHLine(0, 15, 61);
  u8g2.drawHLine(0, 30, 61);
  u8g2.drawHLine(0, 45, 61);
  u8g2.drawVLine(15, 0, 61);
  u8g2.drawVLine(30, 0, 61);
  u8g2.drawVLine(45, 0, 61);
  u8g2.setFont(u8g2_font_crox4t_tr);
  u8g2.drawStr(65, 28, "Score:");
  char score_str[6];
  itoa(score, score_str, 10);
  u8g2.drawStr(65, 48, score_str);

  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 4; ++j)
      if (map[i][j] != 0)
        setNum(i, j);
  u8g2.sendBuffer();
}
void board::setNum(int a, int b)
{
  int num = map[a][b];
  u8g2.drawXBMP(1 + a * 15, 1 + b * 15, 14, 14, GET_NUM_DATA(num));
}

char getKey()
{
  while (!(digitalRead(Up) || digitalRead(Down) || digitalRead(Left) || digitalRead(Right)))
    ;
  bool U = digitalRead(Up);
  bool D = digitalRead(Down);
  bool L = digitalRead(Left);
  bool R = digitalRead(Right);
  while (digitalRead(Up) || digitalRead(Down) || digitalRead(Left) || digitalRead(Right))
    ;
  if (U)
    return 'a';
  if (D)
    return 'd';
  if (L)
    return 'w';
  if (R)
    return 's';
  return 'x';
}

board Game;
void setup()
{
  srand((unsigned)time(NULL) + analogRead(A0));
  u8g2.begin();

}

void loop()
{
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_maniac_tr);
  u8g2.drawStr(30, 24, "2048");
  u8g2.setFont(u8g2_font_7x14B_mr);
  u8g2.drawStr(48, 48, "Start");
  u8g2.drawFrame(45, 36, 40, 15);
  u8g2.sendBuffer();
  getKey();
  Game.init();
#ifdef TEST_MODE
  Game.updateDisplay();
  for (;;);
#endif
  while (!(Game.isOver() || Game.isWon()))
  {
    if (Game.isChanged())
      Game.updateDisplay();
    char cmd = getKey();
    switch (cmd)
    {
      case 'w':
        Game.move(UP);
        break;
      case 'a':
        Game.move(LEFT);
        break;
      case 's':
        Game.move(DOWN);
        break;
      case 'd':
        Game.move(RIGHT);
        break;
      default:
        break;
    }
  }
  Game.updateDisplay();
  delay(2000);
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_maniac_tr);
  if (Game.isWon())
  {
    u8g2.drawStr(23, 24, "You");
    u8g2.drawStr(23, 53, "Win!");
  }
  else
  {
    u8g2.drawStr(23, 24, "Game");
    u8g2.drawStr(23, 53, "Over");
  }
  u8g2.sendBuffer();
  delay(1500);
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_crox4t_tr);
  char score_str[6];
  itoa(Game.getScore(), score_str, 10);
  u8g2.drawStr(20, 28, "Your score:");
  u8g2.drawStr(20, 48, score_str);
  u8g2.sendBuffer();
  delay(2500);
}
```

### Number.h

```cpp
#ifndef _NUMBER_H
#define _NUMBER_H
// width: 14, height: 14
const unsigned char NUMs[][28] U8X8_PROGMEM = {
  {0xff, 0x3f, 0x03, 0x30, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0x03, 0x30, 0xf3, 0x3f, 0xf3, 0x3f, 0xf3, 0x3f, 0xf3, 0x3f, 0xf3, 0x3f, 0x03, 0x30, 0xff, 0x3f},
  {0xff, 0x3f, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0x03, 0x30, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0xff, 0x33, 0xff, 0x3f},
  {0xff, 0x3f, 0x03, 0x30, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0x03, 0x30, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0xf3, 0x33, 0x03, 0x30, 0xff, 0x3f},
  {0xff, 0x3f, 0x33, 0x30, 0x33, 0x3f, 0x33, 0x3f, 0x33, 0x3f, 0x33, 0x3f, 0x33, 0x30, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x30, 0xff, 0x3f},
  {0xff, 0x3f, 0xc1, 0x20, 0xc1, 0x20, 0xdf, 0x2f, 0xdf, 0x2f, 0xdf, 0x2f, 0xc1, 0x20, 0xc1, 0x20, 0xdf, 0x3e, 0xdf, 0x3e, 0xdf, 0x3e, 0xc1, 0x20, 0xc1, 0x20, 0xff, 0x3f},
  {0xff, 0x3f, 0xc1, 0x2e, 0xc1, 0x2e, 0xfd, 0x2e, 0xfd, 0x2e, 0xfd, 0x2e, 0xc1, 0x20, 0xc1, 0x20, 0xdd, 0x2f, 0xdd, 0x2f, 0xdd, 0x2f, 0xc1, 0x2f, 0xc1, 0x2f, 0xff, 0x3f},
  {0xff, 0x3f, 0x19, 0x21, 0x19, 0x21, 0x7b, 0x2d, 0x7b, 0x2d, 0x7b, 0x2d, 0x1b, 0x21, 0x1b, 0x21, 0xdb, 0x2d, 0xdb, 0x2d, 0xdb, 0x2d, 0x11, 0x21, 0x11, 0x21, 0xff, 0x3f},
  {0xff, 0x3f, 0x11, 0x21, 0x11, 0x21, 0xd7, 0x3d, 0xd7, 0x3d, 0xd7, 0x3d, 0x11, 0x21, 0x11, 0x21, 0x7d, 0x2d, 0x7d, 0x2d, 0x7d, 0x2d, 0x11, 0x21, 0x11, 0x21, 0xff, 0x3f},
  {0xff, 0x3f, 0x31, 0x23, 0x31, 0x23, 0x7d, 0x2f, 0x7d, 0x2f, 0x7d, 0x2f, 0x71, 0x23, 0x71, 0x23, 0x77, 0x3b, 0x77, 0x3b, 0x77, 0x3b, 0x31, 0x22, 0x31, 0x22, 0xff, 0x3f},
  {0xff, 0x3f, 0xe3, 0x30, 0xe3, 0x36, 0xe7, 0x36, 0xe7, 0x36, 0xc3, 0x30, 0xff, 0x3f, 0xff, 0x3f, 0xc3, 0x36, 0xdf, 0x36, 0xc3, 0x30, 0xfb, 0x37, 0xc3, 0x37, 0xff, 0x3f},
  {0xff, 0x3f, 0xc3, 0x30, 0xdf, 0x36, 0xc3, 0x36, 0xfb, 0x36, 0xc3, 0x30, 0xff, 0x3f, 0xff, 0x3f, 0xdb, 0x30, 0xdb, 0x36, 0xc3, 0x30, 0xdf, 0x36, 0xdf, 0x30, 0xff, 0x3f}
};

#define GET_NUM_DATA(num) (NUMs[__builtin_ctz(num) - 1])

#endif // _NUMBER_H
```

使用arduinoIDE打开`arduino2048.ino`，在选择了正确的端口、开发板之后，将电脑连接arduino nano，按<kbd>Ctrl+U</kbd>上传程序。

至此，基于Arduino nano在LCD12864上实现的2048小游戏已制作完成。

源代码解析和运行原理分析（超详细）：点我

已开源于github：[点我](https://github.com/blackpancake/arduino2048)