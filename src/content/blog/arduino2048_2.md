---
title: arduino2048小游戏源代码解析（超详细）
description: '这一篇是源码解析，硬件介绍在另一篇。'
publishDate: 2021-08-18 15:44
tags:
  - 技术
  - 软件
  - 硬件
  - 单片机
  - Arduino
---

>  源代码在上一篇文章里，此处不放出完整源代码。
>
> 本篇代码中用于测试的部分（例如`CHEAT`宏定义和`TEST_MODE`宏定义）被移除，以方便讲解。

# 2048游戏规则

2048游戏棋盘上共有4x4=16个格子，初始时存在两个初始数字，其中一个是2，另一个有30%的几率为4，70%的几率为2。

- 手指向一个方向滑动，所有格子会向那个方向运动。

- 相同数字的两个格子，相撞时数字会相加。

- 每次有效滑动后，空白处会随机刷新出一个格子，有30%的几率为4，70%的几率为2。

- 当界面不可运动时（当界面全部被数字填满时），游戏结束；当界面中最大数字是2048时，游戏胜利。

# 简要思路

使用4x4的二维数组模拟2048的游戏棋盘，从左上角(0,0)开始标号：

![image-20210817164938259](https://i-blog.csdnimg.cn/blog_migrate/981c148d93e6d1cdf61f18ad6e6a3deb.png)

数组的每个元素就代表此处格子的数字。

用0表示此处没有数字。


# 游戏界面该如何显示

## 开始界面

“2048”字样选择了`u8g2_font_maniac_tr`字体。

“Start”字样选择了`u8g2_font_7x14B_mr`字体。

![IMG_20210818_155610.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/f5838ea32ce13a38c1dee2d0116ad03e.jpeg)

## 游戏界面

屏幕左侧的棋盘大概类似这样：

![image-20210817224627482](https://i-blog.csdnimg.cn/blog_migrate/ed83ff5b65ec7e38c8a9987793e6b860.png)

每个格子里显示一个数字。

可是，翻遍[u8g2的字体库](https://github.com/olikraus/u8g2/wiki/fntlistall)，仍找不到一款能显示得开四位数2048并且可读性令我满意的一款字体。

但是，为什么一定要用字体呢？

每个含有数字的格子放一张代表这个数字的位图不也行吗？

我另辟蹊径，用Ps为从2到2048的所有所需数字绘制了14x14大小的位图，通过[取字模网站](http://tools.clz.me)转换为字模，发现显示效果非常不错。

> 附：绘制的位图（已上传到[github](https://github.com/blackpancake/arduino2048/tree/main/Number model)）：
>
> ![image-20210817225345550](https://i-blog.csdnimg.cn/blog_migrate/f94aa7bbc596bca5c3e24d69c4973c73.png)

![IMG_20210818_155355.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/f6f678e75daa00df6df3eab8002b3c61.jpeg)

## 结算界面

“Game Over”字样和“You Win!”仍然是`u8g2_font_maniac_tr`字体。

![IMG_20210818_155521.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/6206fab64c21778cfdca6885fbb69a60.jpeg)

![new](https://i-blog.csdnimg.cn/blog_migrate/b971bbbc52dd4c1cda2875cea149ae6e.jpeg)

“Your score: xxx”字样是`u8g2_font_crox4t_tr`字体。

![IMG_20210818_155511.jpg_new](https://i-blog.csdnimg.cn/blog_migrate/e5381c2d9c7bddb44f1c478e97a84d8b.jpeg)

# 代码分析

## 杂项

首先是头文件引入，没什么好说的，`time.h`用于获取时间为随机数提供种子，`U8g2lib.h`是u8g2库的头文件，用于在LCD12864上绘图。

```cpp
#include <time.h>
#include <U8g2lib.h>
```

然后是实例化一个u8g2绘图对象，这里由于搭建电路时LCD12864反向摆放，所以画面标志位由原本的`U8G2_R0`改为`U8G2_R2`。

10号管脚是CS片选，12号管脚是显示屏的RST复位。（详见上一篇博客）

```cpp
U8G2_ST7920_128X64_F_HW_SPI u8g2(U8G2_R2, /* CS=*/10, /* reset=*/12);
```

接下来是`Number.h`的引入，待会再讲。

```cpp
#include "Number.h"
```

接下来是4个方向的轻触按钮所连管脚的宏定义：

```cpp
#define Up 4
#define Down 5
#define Left 6
#define Right 7
```

这里定义了一个内联函数`int getRand(int a, int b)`，作用是获取 $[a,b]$ 之间的一个随机整数。

原理基于c++内置的`rand()`函数，具体请自行百度。

```cpp
inline int getRand(int a, int b)
{
    return rand() % (b - a + 1) + a;
}
```

这里定义了四个方向的枚举变量，之后在`move`函数上会用到。

```cpp
enum DIRECTION
{
    LEFT,
    RIGHT,
    UP,
    DOWN
};
```

## board类

接下来就是重头戏了，棋盘类`board`的定义，待会会分开对每个方法进行分析：

```cpp
class board
{
private:
    int map[4][4];
    long score;
    using PtrToMemberFunc = bool (board::*)(int);
    PtrToMemberFunc Moves[4] = {&board::LeftOne, &board::RightOne, &board::UpOne, &board::DownOne};
    bool changed;

public:
    void init();
    void summon(bool noFour = false);
    bool isOver();
    bool isWon();
    bool isChanged()
    {
        return changed;
    }
    int getScore()
    {
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
```

### 属性

首先来看私有的一些属性：

模拟地图：

```cpp
    int map[4][4];
```

存分数（这里保险起见，用了long存分数）：

```cpp
    long score;
```

下面的两行先跳过，待会在讲`move`函数时会讲。

棋盘是否在移动后被改变了的标志位：

```cpp
    bool changed;
```

### 方法

#### summon方法

```cpp
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
            if (map[i][j] == 0)
                blanks[ptr++] = {i, j};
    block &sele = blanks[getRand(0, ptr - 1)];
    if (noFour)
        map[sele.x][sele.y] = 2;
    else
        map[sele.x][sele.y] = getRand(1, 10) > 3 ? 2 : 4;
}
```

该方法用于在棋盘上空白位置生成一个数字，在开局时和每次有效滑动后被调用。

在解释方法如何运行之前，先谈谈生成数字的思路吧！

这里采用的思路是，遍历整个棋盘，将所有空白位置记录下来到队列里，

然后从队列中随机选取一个空白位置，将棋盘的这个位置放上数字。



方法内部定义了表示一个空白位置的结构体`block`，它拥有两个成员，分别记录某个空白格子在棋盘上的坐标，并顺便创建了一个长16的（因为棋盘上最多只可能有16个空白位置）`block`类型的数组`blanks`。

```cpp
    struct block
    {
        int x;
        int y;
    } blanks[16];
```

之后利用`memset`将队列清零（初始化），并定义了一个用于自增的指针`ptr`，初始时指向队列首位元素。

```cpp
    for (int i = 0; i < 4; ++i)
        for (int j = 0; j < 4; ++j)
            if (map[i][j] == 0)
                blanks[ptr++] = {i, j};
```

两个for循环遍历数组，if判断该格是否为空，是则加入队列。

注意，`ptr++`实际上是返回现在的`ptr`之后，再将`ptr`自增。赋值号右侧是花括号形式的结构体赋值。

显然，遍历完成之后，`ptr`指向队尾元素的下一个位置，不难看出，只需要在 $[0,ptr-1]$ 中随机选择一个整数作为`blanks`数组的下标，就相当于随机选取了一个空白格。

于是便有了下面这行代码：

```cpp
block &sele = blanks[getRand(0, ptr - 1)];
```

此处为了节省内存，创建了一个对被选择了的空白格的引用，方便后续从它身上获取数据。

```cpp
if (noFour)
        map[sele.x][sele.y] = 2;
    else
        map[sele.x][sele.y] = getRand(1, 10) > 3 ? 2 : 4;
```

因为我们有“不许生成4”的需求（在开局时有一个初始数字只能为2），所以加入了`noFour`标志位作为函数的参数，它为`true`时就代表此时的`summon`方法不会生成4。

这里使用了“在1到10之间随机选择一个数看是否大于3”的方法来模拟三七分的生成概率。

#### init方法

```cpp
void board::init()
{

    memset(map, 0, sizeof(map));
    summon();
    summon(true);
    changed = true;
    score = 0;
}
```

此函数对整个棋盘对象进行初始化，在开始游戏和重新游戏时被调用。

使用`memset`内置函数对棋盘数组清零后调用两次`summon`方法生成两个初始数字。

注意，第二次调用`summon`时，为了防止出现“双4开局”的情况，将`noFour`标志位置位。

`changed`被设为`true`，以便让游戏主循环调用`updateDisplay`方法，进行屏幕的首次刷新。

#### isOver方法

```cpp
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
```

该方法返回游戏是否结束，每次移动后，游戏主循环就会调用它以检测是否因为这次移动而导致游戏的终结。

判断思路：

首先可以肯定的是，对于给定的一个2048游戏局面，只要棋盘上还存在空位，那就说明游戏还没有结束。

假如没有空位了呢？

那就检测是否有能够合并的。

从左上角(0,0)开始遍历，对于某一个格子，若它右侧或者下方有相同的格子，就代表它还可以合并，也代表着游戏还没结束。

为什么不检测左侧和上方？

事实上，如果向右滑动棋盘时某个格子会被合并，那么即使向左滑动棋盘，它仍然会被合并，两个滑动方向在这个问题上是等价的。向上向下滑也是同理。因此只检测右侧和下方就够了。

需要注意的是，为了防止数组越界（例如在棋盘最右边试图寻找更右侧的格子），加入了坐标上的限定。即对于最右侧的格子不检测其右侧，对于最下方的格子不检测其下方。

#### isWon方法

```cpp
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
```

该方法返回游戏是否胜利，即棋盘中是否含有2048这个数字。

原理很简单，两个for循环遍历棋盘，查找是否存在2048即可。

`map[i][j] >= 2048`中的`>=`也可以换成`==`。

#### isChanged方法

```cpp
bool isChanged()
{
    return changed;
}
```
内联接口，用于从外部获取`changed`属性的值。

#### getScore方法

```cpp
int getScore()
{
    return score;
}
```
内联接口，用于从外部获取`score`属性的值。

#### LeftOne等方法

> `RightOne`、`UpOne`、`DownOne`等方法与`LeftOne`方法的代码极其相似，所以此处只放出`LeftOne`方法的代码。

```cpp
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
```

这个方法是2048游戏的核心所在，它负责移动和合并一行（列）的数字。

在解释方法如何运行之前，先谈谈移动与合并的思路吧！

> 此处的逻辑思路参考了[这篇博客](https://blog.csdn.net/weixin_42751067/article/details/81139575)

不难发现，在向某个方向滑动棋盘时，该方向上的行（列）是互不干扰的。即，对于每行 （列）所进行的操作是相同的。

因此我们可以把问题规模缩小，缩小到如何在一行（列）上实现移动+合并。

此处的思路如下（暂时以向左滑动为例）：

![image-20210817185659611](https://i-blog.csdnimg.cn/blog_migrate/dd39b4342e133f427d366eefe357b0d2.png)

1. 首先将c指针指向最左边的元素
2. 在c的左侧向右寻找第一个非0元素，将nextc指向它（这是第2步）
3. 如果找到了
    1. 如果c指向的值是0
        1. 让nextc和c所指向的格子交换它们的值
    2. 如果c指向的值等于nextc指向的值
        1. 将c指向的值乘2
        2. 分数加上c指向的值
        3. 将nextc指向的值置0
    3. c指向下一个元素，若已经完成该行（列）上所有元素的遍历，否则回到第2步
4. 否则
    1. 结束过程

这个过程结束后就能在一行（列）上同时完成移动和合并两大任务。

对四个行（列）各进行一遍这样的操作，一次棋盘的滑动就完成了。

讲完思路，再看代码就很容易看懂了。



```cpp
while (c < 4)
```

这行代码让c在完成所有元素的遍历后自动退出循环。

```cpp
        int nextc = c + 1;
        while (nextc < 4 && map[ro][nextc] == 0)
            nextc++;
```

这些代码让nextc从c的右侧开始寻找非零格，`nextc < 4`让循环在找不到非零格时自动退出寻找的循环。

```cpp
        if (nextc >= 4)
            break;
```

这些代码让找不到非零格时退出移动-合并的过程。

```cpp
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
```

和上述的思路基本一一对应，就不解释了。

```cpp
++c;
```

这行代码让c指向下一个元素。



这时你可能会注意，为什么代码里有一个变量`fail`？

此时，我们要引入两个概念：**有效移动**和**有效滑动**。

对于一行（列）来说，如果在进行一次上述的移动-合并操作后，这一次移动-合并操作起了效果（即这一行（列）发生了变化，比如位置移动了，或者发生了合并），那么就称这次移动-合并操作是一次**有效移动**。

对于一个棋盘来说，如果在对四行（列）分别进行四次上述的移动-合并操作后，棋盘的状态发生了变化，那么就称这四次移动-合并操作是一次**有效滑动**。

那么，在`LeftOne`方法里，`fail`就代表着这次移动-合并操作是否不是一次有效移动，或者更通俗一点，这次移动-合并操作是否失败。

函数最开始时将`fail`设为`true`，在循环中，如果发生移动（`if (map[ro][c] == 0)`）或合并（`else if (map[ro][c] == map[ro][nextc])`），就把`fail`设为`false`，最后将`fail`返回。

需要注意的是，函数的参数`ro`，表示对第`ro`行（列）进行移动-合并操作。

另外，虽然此处只展示了向左的移动-合并操作，但其实其他三个方向的原理也是相同的，此处就不放出代码了。

#### move方法

```cpp
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
```

此方法的代码虽短，但也是代码中的关键所在。

先把`fail`相关的代码暂时去掉，此时该方法就只剩下两行代码了：

```cpp
for (int i = 0; i < 4; ++i)
    (this->*Moves[di])(i);
```

没错，这两行就是关键。

在研究这两行之前，先给出`move`方法的意义吧：`move(X)`使棋盘向`X`方向滑动。这里的`X`是枚举类型`DIRECTION`的，这意味着它可以有四个取值：`LEFT`、`RIGHT`、`UP`、`DOWN`，分别是`0`、`1`、`2`、`3`的别名。

要想使棋盘向某个方向滑动，就对四个行（列）分别调用对应的`XXXOne`方法进行移动-合并操作。

例如想让整个棋盘向左滑动，就要执行以下代码：

```cpp
LeftOne(0);//对第一行进行移动-合并操作。
LeftOne(1);//本行及以下同上
LeftOne(2);
LeftOne(3);
```

这太臃肿了！

你一定会想到用for循环简化：

```cpp
for (int i = 0; i < 4; ++i)
    LeftOne(i);
```

好了，现在向左滑动只需要两行代码了。可是，向右呢，向上向下呢？也要写一遍这样的for循环然后用if根据`di`判断用哪个吗？

不行，这太臃肿了，不符合*DRY(Don't Repeat Yourself)*原则！

怎样才能让`di`直接动态的与四个方法联系起来呢？

用函数指针！

更确切地，是用成员函数指针数组。

将四个指向各方向的移动-合并操作方法的指针组织成一个数组，用`di`作数组的下标就可以实现了。

于是便有了在前文中提到的：

```cpp
using PtrToMemberFunc = bool (board::*)(int);
PtrToMemberFunc Moves[4] = {&board::LeftOne, &board::RightOne, &board::UpOne, &board::DownOne};
```

第一行使用了C++11独有的（没错，arduino~~部分~~支持C++11！）`using type_New = type_Old`的语法来给“指向各方向的移动-合并操作方法的指针”这一类型取了一个别名`PtrToMemberFunc`。

此处在`*`号前加`board::`是因为成员函数指针前面要有类名的指定否则会编译不过。

第二行定义了一个长度为`4`的（因为是4个方向的成员函数嘛）元素类型为`PtrToMemberFunc`的数组，四个元素初始化为指向四个成员函数的函数指针。

其实第二行的`&board::`是可以去掉的，但是会有警告，为了满足强迫症，还是加上了。



定义完了成员函数指针数组，该怎么用它调用成员函数呢？

你可能会脱口而出：

```cpp
Moves[di](i);//i是参数
```

很抱歉，编译失败。

然后，你可能会抱着试一试的心态敲下：

```cpp
(*Moves[di])(i);//i是参数
```

很抱歉，编译失败。

经过一番尝试和查阅资料，真相终于大白：

```cpp
(this->*Moves[di])(i);
```

为什么这里会有`this->`？说实话，我也不知道，但是加上就编译成功了（摊手）。

无论如何，`move`方法的核心两行代码终于理解了：

对于棋盘的每一行（列），根据传入的方向参数`di`，调用对应方向的移动-合并操作方法。



接下来就是`move`方法中的`fail`了。

这里的`fail`的意义和移动-合并操作方法中的`fail`意义差不多，但又有所区别，它代表着这次对棋盘的滑动是否不是一次棋盘上的有效滑动，或者更通俗一点，这次滑动是否失败。

再来想一下，已知四个行（列）上的移动-合并是否失败，能否得出整次滑动是否失败？

容易得出，除非四个行（列）上的移动-合并全部失败才算失败，只要有一行（列）成功，就算成功。

也就是说，将四次移动-合并的返回值全部进行`&`与操作，得到的结果就是整次滑动是否失败。

`fail`的初始值只能是`1`，毕竟如果是`0`的话，无论再`&`与多少个`1`，结果还是`0`，这肯定不是我们想要的。

另外，因为每次移动（调用`move`方法）都存在使棋盘局面改变的可能~~（这不废话吗？）~~，因此我们需要在滑动未失败时（`fail==0`）将`changed`置位。

比`if(fail==0) changed=1;`更简洁的写法是`changed=!fail;`，所以这里采用了后者。

另外，根据游戏规则，我们需要在滑动未失败时（`fail==0`），在空白处生成新数字，这点需要注意。

#### setNum方法

```cpp
void board::setNum(int a, int b)
{
    int num = map[a][b];
    u8g2.drawXBMP(1 + a * 15, 1 + b * 15, 14, 14, GET_NUM_DATA(num));
}
```

该方法用于将棋盘给定位置的数字在屏幕上绘制出来。

`setNum(a,b)`将会在屏幕上的对应位置绘制出`map[a][b]`里的数字。

在讲解该方法之前，我们需要先看一下`Number.h`的内容：

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

`Number.h`定义了一个二维数组，用于存放从2到2048十一个游戏里会用到的数字的字模。

正如前文所提到的，程序采用绘制位图字模的方式来显示一个含有数字的格子。

为了方便动态地取出字模数据，需要使用二维数组存放字模数据。

这样，`NUMs[0]`就是指向存放`2`的字模数据数组的指针（没错，一个指向数组的指针）。

同理，`NUMs[1]`可以取出`4`的字模数据，`NUMs[10]`可以取出`2048`的字模数据……

但是，我们从棋盘上得知的是该格子包含的数字，例如`2`、`16`、`512`这样的整数，怎么才能把它们转换成二维数组的第一维的下标呢？

换句话说，怎么才能把序列 $2,4,8,16,\cdots,1024,2048$ 映射为 $0,1,2,3,\ldots,9,10$ 这个序列呢？

显然可以用对数运算。假如我们想要绘制数字 $x$ 的字模，则 $\log_2x-1$ 就是它在`NUMs`数组第一维的下标。

事实上，有一个比对数运算更高效的方法：

~~avr~~gcc编译器有一个内建函数`__built_in_ctz`，`__built_in_ctz(p)`返回`p`在二进制下尾随零的个数，如果`p`只取2的幂，那么它和  $\log_2x$的结果是一样的。

所以就有了`Number.h`中的宏定义：

```cpp
#define GET_NUM_DATA(num) (NUMs[__builtin_ctz(num) - 1])
```

`GET_NUM_DATA(num)`返回指向存放`num`这个数字对应的字模数据的数组的指针。

于是就有了以下的绘制语句：

```cpp
u8g2.drawXBMP(1 + a * 15, 1 + b * 15, 14, 14, GET_NUM_DATA(num));
```

`drawXBMP`方法的前两个参数分别是要绘制出的位图的左上角的坐标，因为正如前文所提到的，棋盘上一个空格的大小是14x14，所以可以用`map`数组下标`a`和`b `推算偏移值从而得知坐标。

之后的两个参数是位图的长宽，在这里是一个空格的大小14x14。

之后就是上文中的`GET_NUM_DATA`，根据`num`获取其字模数据。

需要注意的是，为了节省RAM，将存字模的二维数组用` U8X8_PROGMEM`（其实用`PROGMEM`宏也是一样的，因为`U8X8_PROGMEM`是`PROGMEM`宏的别名）存入了PROGMEM里，所以绘制字模是使用的是支持PROGMEM的`drawXBMP`而不是`drawXBM`。

#### updateDisplay方法

```cpp
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
```

该方法负责按照`map`数组的内容在LCD12864上绘制（更新）棋盘，同时更新分数。

棋盘的边框是由一个空心矩形内部画上横三竖三的直线形成的。

```cpp
    u8g2.drawStr(65, 28, "Score:");
    char score_str[6];
    itoa(score, score_str, 10);
    u8g2.drawStr(65, 48, score_str);
```

这是负责更新分数的部分，首先绘制“Score:”字样，然后创建了一个局部变量的数组用于缓存`itoa`方法转换出的字符串数据。

`itoa`内置函数将整数在给定进制下转换为字符串形式。

第一个参数是要转换的整数，在这里是分数。

第二个参数是转换结果的缓冲区。

第三个参数是整数的进制，这里当然需要使用10进制。

虽然`itoa`是非标准的，但arduino还是支持了。

```cpp
for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 4; ++j)
        if (map[i][j] != 0)
            setNum(i, j);
```
两个for循环用于遍历棋盘，对于非空的格子，调用`setNum`方法将其绘制出来。

需要注意的是，由于屏幕的绘制模式采用的是`full_buffer`模式，所以对屏幕的每一次更新都要放在两句代码之间，两句代码的意义从字面也不难看出：

```cpp
u8g2.clearBuffer();
...
u8g2.sendBuffer();
```

## getKey函数

```cpp
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
```

该函数独立于board类，用于阻塞地获取玩家点击的按钮方向。

```cpp
    while (!(digitalRead(Up) || digitalRead(Down) || digitalRead(Left) || digitalRead(Right)))
        ;
```

这行代码意思是“持续等待，直到四个方向的按钮中任意一个被按下”。

因为是阻塞式地获取，所以在发生按按钮事件之前需要一直等待下去。

当按下按钮的事件发生，就用四个变量缓存一下当前四个按钮的按下与否。

切忌不能此时就返回结果，因为如果这样会造成玩家一直按着就会一直发生移动，而我们期望的行为是“在玩家松开按钮后再进行移动”，于是就有了下面的代码：

```cpp
    while (digitalRead(Up) || digitalRead(Down) || digitalRead(Left) || digitalRead(Right))
        ;
```

这行代码意思是“持续等待，直到四个方向的按钮全部松开”。

当松开的事件发生后，就可以返回结果了。

因为LCD12864是反向摆放，所以需要进行反转和镜像，所以加入一个中间层（wasd）用来抹除屏幕旋转带来的方向改变。

需要注意的是，不同的按钮电路连接也会造成该层UDLR和wasd的对应关系不同，所以实际制作时需要在这个地方反复调试直到方向对应正确为止。

`return 'x'`是可以去掉的，只是保险起见加上，换成别的除wasd以外的字符也可以。

## setup：开机时的准备工作

```cpp
board Game;
void setup()
{
    srand((unsigned)time(NULL) + analogRead(A0));
    u8g2.begin();
}
```

在实例化了一个board类的对象`Game`后，接下来就是熟悉的、每个arduino程序都有的函数——setup函数了。

`srand`用于设定接下来随机数序列的种子，这里就用到了`time.h`里的`time`函数获取时间戳，同时为了增加随机数的随机性，把时间和`analogRead`读取一个未`pinMode`设置过的、悬空的模拟端口得到的数字（具体数字主要受环境中的电磁噪声影响）加在了一起。

然后调用了u8g2`begin`方法进行了绘图库的初始化。

## loop：游戏主循环

```cpp
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

众所周知，arduino的loop函数会不断地重复执行下去。在本程序中，loop的一次重复，就是一个完整的游戏生命周期，从开始界面到结算界面。

首先夹在`u8g2.clearBuffer();`和`u8g2.sendBuffer();`中的是开始界面的绘制，没什么好说的，主要是边框的绘制一定要放在“Start”字样的绘制之后，否则“Start”字样字体的透明像素会覆盖掉边框的一部分，让边框出现一个豁口。

之后的一次丢弃返回值的`getKey`函数的调用是为了模拟“按任意键开始”的效果，它是阻塞的，也就是说在按下任意键之前将会一直停留在开始界面。

之后调用`Game`对象的`init`方法，进行棋盘和游戏数据的初始化。

接下来是一个较大的while循环：

```cpp
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
```

每次运行循环中的内容前都会先检测是否终局或者获胜，游戏没有结束的话，就判断棋盘状态是否变更，若是，则更新棋盘的绘制。

之后阻塞地获取玩家按下的按钮，存入`cmd`变量中。

switch语句对于不同的中间层（wasd）数据对应地改变`move`方法的参数并调用。

等到while循环退出之后，就说明游戏结束了（终局或获胜），此时开始结算。

需要注意的是，在开始结算之前，需要再次更新一次棋盘绘制，否则玩家无法看见死亡时棋盘的状态。

2秒后进入结算页面，首先根据是否获胜显示对应的语句（“GameOver”或“YouWin!”）。

1.5秒之后显示分数，逻辑和更新棋盘绘制时的逻辑显示，就不赘述了。

再过2秒，loop函数返回，进入新的一次游戏生命周期。



至此，Arduino2048游戏的实现逻辑已全部讲述完毕。