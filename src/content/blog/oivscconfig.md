---
title: 实用干货！把VSCode打造成oi刷题利器
description: '时效性文章'
publishDate: 2021-02-12 20:04
tags:
  - 技术
  - 软件
  - OI
  - VSCode
  - 配置教程
---

广大使用C++编程的OIer：

你还在用UI丑陋、调试难受、连代码补全都没有的**Dev cpp**刷题？

快来尝试一下号称“宇宙最强编辑器”的**VSCode**！

颜值[珂](https://baike.baidu.com/item/%E7%8F%82%E6%9C%B5%E8%8E%89%C2%B7%E8%AF%BA%E5%A1%94%C2%B7%E7%91%9F%E5%B0%BC%E6%AC%A7%E9%87%8C%E6%96%AF)爱的外表，成百上千的多样主题！强大的代码补全！便捷的运行方式！

不多废话，开整！

# 提示

> 本文的所有操作和配置在**64位Windows 10**系统下进行，在其他系统下的操作和配置可能略有出入。

# 下载VSCode

打开浏览器前往[VSCode官网](https://code.visualstudio.com/)：

![code.visualstudio.com_](https://i-blog.csdnimg.cn/blog_migrate/1483595e942421df3bb3e56206f91a64.png)

点击**Download for Windows**按钮下载**VSCode**安装包。

然后一路next下去，安装完成！

> 最好不要安装在C盘

# 优化VSCode

参照我的另一篇文章[《优化VSCode：让你的VSCode变得好用又美观》](https://blog.csdn.net/Cykinter/article/details/113792738)对你的VScode进行优化。

> 如何打开setting.json？
>
> 快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入 **Open Settings (JSON)**。
>
> 即可打开settings.json
>
> > 编辑完毕记得保存哦！

# 安装MinGW编译器

## 下载并解压

由于MinGW官网在国外，下载极慢且最近疑似遭到污染，所以我准备了下载好的MinGW压缩包放在[BaiDu网盘](https://pan.baidu.com/s/1qDFUFFmkf2TZsHfVMK7I_A)（提取码：`5cy2`），可能不是最新版，但对于OI来说够用了。

下载压缩包后，将压缩包解压至磁盘上你喜欢的路径，重命名文件夹为你喜欢的名字。（路径和名字不要含有任何**空格**、**中文**或**其他非ASCII字符**，路径越短越好，最好不要在C盘）

![image-20210212112703514](https://i-blog.csdnimg.cn/blog_migrate/324398e88f5c857393e83867501122f4.png)

> 笔者这里将解压路径设为`D:\MinGW64`

解压后目录应为类似如下结构：

```
D:
MinGW64
|- bin
|- bulid-info.txt
|- etc
|- include
|- lib
|- libexec
|- opt
|- share
|- x86_64-w64-mingw32
```

## 设置环境变量

别急！现在还没有安装完成，还需要设置环境变量。

进入控制面板 -> 高级系统设置 -> 环境变量 -> 选择用户变量区域的`Path`环境变量 -> 点击下方的“编辑” -> 新建

输入`你的MinGW安装路径\bin`，一路确定，设置成功！

> 笔者这里设置的环境变量内容是`D:\MinGW64\bin`

## 检验是否成功安装

打开cmd，输入`g++`若显示：

![image-20210212114830213](https://i-blog.csdnimg.cn/blog_migrate/cbd41b0880424ae0ee0080fa87aea6eb.png)

则代表成功安装。 

# 安装插件

必须安装以下插件才能愉快的刷题：

![image-20210212171819376](https://i-blog.csdnimg.cn/blog_migrate/480a95694ef98ad4c9c6687b0dea3a80.png)

![image-20210212171829218](https://i-blog.csdnimg.cn/blog_migrate/2e1558a80992a9afd628a07590b2529f.png)

# 配置

在磁盘中新建一个路径和名称中不含有任何**空格**、**中文**或**其他非ASCII字符**的文件夹（路径越短越好，最好不要在C盘），这个文件夹就是你以后做题时写代码、保存代码、运行代码的地方了，我们称之为**家目录**。

在**家目录**下新建文件夹，取名为`.vscode`（注意是小写）。

在`.vscode`文件夹下新建三个文件：

- `tasks.json`（用于配置构建任务）
- `launch.json`（用于配置调试）
- `c_cpp_properties.json`（用于配置c/cpp选项）

将以下内容粘贴至对应的json文件中（记得补全汉字标识**你的MinGW安装路径**并去掉注释）：

## launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Launch", // 配置名称，将会在启动配置的下拉菜单中显示  
            "type": "cppdbg",
            "request": "launch", // 请求配置类型，可以为launch（启动）或attach（附加）  
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe", // 将要进行调试的程序的路径  
            "args": [], // 程序调试时传递给程序的命令行参数，一般设为空即可  
            "stopAtEntry": false, // 设为true时程序将暂停在程序入口处，一般设置为false
            "cwd": "${fileDirname}", // 调试程序时的工作目录
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "miDebuggerPath": "你的MinGW安装路径\\bin\\gdb.exe", // miDebugger的路径，注意这里要与MinGw的路径对应
            "preLaunchTask": "g++ build",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

## tasks.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "g++ build",
            "command": "你的MinGW安装路径\\bin\\g++.exe",
            "args": [//编译参数列表
                "${file}",
                "-fexec-charset=GBK",
                "-static-libgcc",
                "-g",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe",
            ],
            "problemMatcher": [
                "$gcc"
            ]
        }
    ]
}
```

## c_cpp_properties.json

```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${workspaceFolder}/**"
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE",
                "__cdecl=__attribute__((__cdecl__))"
            ],
            "cStandard": "c11",
            "cppStandard": "c++11",
            "intelliSenseMode": "gcc-x64",
            "browse": {
                "path": [
                    "${workspaceFolder}"
                ]
            }
        }
    ],
    "version": 4
}
```

至此，`.vscode`文件夹的内容就配置完毕了。

> 可以有多个**家目录**。事实上，它们只是拥有`.vscode`文件夹的普通目录而已。配置好一个`.vscode`文件夹后，可以将`.vscode`文件夹保存起来备用。当部署其他的**家目录**时，可以把以前的`.vscode`文件夹拷贝进去以免去再次配置的麻烦。
>
> 换句话说，
>
> 拥有`.vscode`目录并正确配置了`launch.json`、`tasks.json`、`c_cpp_properties.json`三个配置文件的目录就叫做**家目录**。
>
> **家目录**中以及其下无论多深的目录中，都可以正确地进行c/cpp的代码补全、编译运行和调试。
>
> **家目录**下的目录名称中最好不含有任何**空格**、**中文**或**其他非ASCII字符**。
>
> 最好不要在`.vscode`文件夹中添加除了配置文件以外的东西。

# 愉快地编译与调试

在上述工作都顺利完成后，赶快在**家目录**下新建一个`.cpp`文件吧！

> 如何新建文件：在侧边栏文件管理器中右键可唤出菜单，之后的操作几乎如同在windows资源管理器中一样。

在文件中写下你的代码。

## 编译之后运行

写好代码后，你可以按如下几种方式运行你的代码：

- 按<kbd>Ctrl+\~</kbd>键（<kbd>\~</kbd>键一般在<kbd>Esc</kbd>键的下方）唤出控制台，手动输入编译命令，手动在终端运行（这种方式原始粗暴但不容易出问题，不过它似乎使前面所做的那么多工作几乎白做了）
- 按<kbd>Ctrl+F5</kbd>键，等待一小会后会弹出黑色cmd窗口，在窗口里面运行的便是你的程序。
    - 缺点：似乎不能方便的在代码运行结束后暂停以方便查看运行结果，而且窗口弹出前的“准备时间”似乎很长。
    - 解决方案：鼠标移到某行行号的左侧或在某行上按<kbd>F9</kbd>可以打一个断点，程序运行至此处会暂停，借助这个方法，我们可以在`return 0;`行处打断点来暂停程序。（很不优雅的方式）
- 通过**Code Runner**插件快捷地运行，方法下文会介绍（推荐使用该方法）

## 仅编译

通过<kbd>Ctrl+Alt+B</kbd>唤出生成任务列表，选择`C/C++: g++.exe生成活动文件 `以做到只编译而不运行。

## 调试

通过按下<kbd>F5</kbd>键来为你的代码启动调试。

或者点击侧边图标栏的：

![](https://i-blog.csdnimg.cn/blog_migrate/8d2c7f605e09718a5b940de37557d7f5.png)

然后点击：

![](https://i-blog.csdnimg.cn/blog_migrate/073b7fd73c9692c1fba097e961426dc5.png)

也可以为你的代码启动调试。

> 尽管<kbd>F5</kbd>看起来和运行没什么区别，但是请不要使用调试代替运行，即不要使用<kbd>F5</kbd>代替<kbd>Ctrl+F5</kbd>。

调试界面介绍：

![](https://i-blog.csdnimg.cn/blog_migrate/f0f794c2d0ddf268f74b48bf99d823ac.png)

来尝试一下用**VSCode**调试代码吧！

# 快捷地运行（使用Code Runner）

还记得[《优化VSCode：让你的VSCode变得好用又美观》](https://blog.csdn.net/Cykinter/article/details/113792738)中提到的**Code Runner**插件吗？

现在它可以帮助我们快捷地运行我们的cpp代码！

## 使用Code Runner比按Ctrl+F5键好在哪里？

首先，按<kbd>Ctrl+F5</kbd>键的运行方式本质其实也是调试，只是减少了启动的调试服务，但是仍有一部分调试服务被启动，启动速度慢。

而使用**Code Runner**本质是在控制台输入命令，和最原始的手动敲命令编译运行有异曲同工之妙，轻量级，启动速度快。

其次，按<kbd>Ctrl+F5</kbd>键的运行方式会在编译时加入`-g`参数，加入了这个参数生成的可执行文件保留了调试所需的代码信息，而我们使用**Code Runner**的初衷是**运行**而不是**调试**，多余的代码信息只会降低**编译速度**和**运行速度**。

还有一点，按<kbd>Ctrl+F5</kbd>键的运行方式需要靠**打断点**的方式在程序结束前暂停程序，并且是在弹出的黑窗口运行，脱离了**VSCode**，很不方便也很不优雅。

而使用**Code Runner**可以通过**ConsolePauser.exe**实现自动暂停代码同时**显示代码运行耗时**（就像**Dev cpp**一样），不靠打断点。并且能在**VSCode**的内置终端里运行，始终不脱离**VSCode**，没有黑窗口，更方便。

所以，个人认为使用**Code Runner**比按<kbd>Ctrl+F5</kbd>键好。

## 配置

首先按照[《优化VSCode：让你的VSCode变得好用又美观》](https://blog.csdn.net/Cykinter/article/details/113792738)配置**Code Runner**插件。

然后在`"code-runner.executorMap"`设置项的大括号中加入如下内容（注意补全汉字标识**ConsolePauser.exe的路径**）：

```json
"cpp": " cls && cd /d $dir && g++ $fullFileName -static-libgcc -std=c++11  -fexec-charset=GBK -o \"$fileNameWithoutExt.exe\" && ConsolePauser.exe的路径\\ConsolePauser.exe $dirWithoutTrailingSlash\\$fileNameWithoutExt.exe\"",
"c": " cls && cd /d $dir && gcc $fullFileName -static-libgcc -std=c++11  -fexec-charset=GBK -o \"$fileNameWithoutExt.exe\" && ConsolePauser.exe的路径\\ConsolePauser.exe $dirWithoutTrailingSlash\\$fileNameWithoutExt.exe\"",
```

你可能会问**ConsolePauser.exe的路径**是什么东西？

别急，我们慢慢分析。

---

首先，**Code Runner**似乎没有**自动暂停**并**显示代码运行耗时**的功能，如何才能在**Code Runner**中实现**Dev cpp**中**自动暂停**并**显示代码运行耗时**的功能（毕竟这个功能对OIer来说很重要）呢？

经过一番的苦思冥想，终于找到了解决方案：**借！**

借？向谁借？

向**Dev cpp**借！

在**Dev cpp**安装目录下发现了这么一个文件：

![image-20210212194245506](https://i-blog.csdnimg.cn/blog_migrate/5fa3f13f8f5787908855d3e6e830b452.png)

它在命令行参数中接收一个程序路径，运行程序后**自动暂停**并**显示代码运行耗时**。

就像这样：

![image-20210212194512390](https://i-blog.csdnimg.cn/blog_migrate/ccf54b712b57ee096e818723e85ac73b.png)

我们可以单独将这个文件提取出来，借助它实现我们想实现的功能。

这边已经将其提取出来了，放在[BaiDu网盘](https://pan.baidu.com/s/1WrOWo9HF7SNSrJyI-1RxVg)（提取码：`x124`）中，大家可以自己下载。

下载完了之后，将其安置在磁盘中你喜欢的位置（路径和名称中不含有任何**空格**、**中文**或**其他非ASCII字符**，路径越短越好，最好不要在C盘）

这个路径就是上面提到的所需填写的**ConsolePauser.exe的路径**。

一切配置完成后，让我们写一个程序，并用**Code Runner**运行一下吧：

> 提示：通过<kbd>Ctrl+Alt+N</kbd>快捷键可以代替按下绿色小三角的方式运行。

![1r](https://i-blog.csdnimg.cn/blog_migrate/c6ef242e6ed7e56c0f1de3063dee5981.gif)

至此，你成功拥有了一个刷题的利器：**VSCode**！