---
title: 一次 MinGW 编译后 exe 直接退出 1 的诡异问题
description: '原来是STM32CubeCLT和stlink_server捣鬼'
publishDate: 2026-5-16 20:40
tags:
  - 技术
  - 软件
  - debug
  - c++
---
最近在 Windows 11 上遇到一个很诡异的问题：  
机器上装了多套 MinGW / GCC，其中只有一套 `D:\Greensoftware\mingw64` 下的 `g++` 出现异常。

现象是：

```bat
g++ main.cpp -o main.exe
main.exe
echo %ERRORLEVEL%
```

无论编译什么 C++ 代码，生成的 exe 都无法正常运行，直接返回：

```text
1
```

但奇怪的是，其他几套 `g++` 都能正常编译和运行。

## 环境背景

机器上大概有这些工具链：

```text
Dev-Cpp 自带 MinGW64
CLion 自带 MinGW
raylib / w64devkit
D:\Greensoftware\mingw64
STM32CubeCLT / STM32CubeProgrammer
```

其中出问题的是：

```text
D:\Greensoftware\mingw64\mingw64\bin\g++.exe
```

它的版本信息大致是：

```text
gcc version 16.1.0
Target: x86_64-w64-mingw32
Thread model: win32
x86_64-win32-seh
```

一开始怀疑过异常模型、线程模型、GCC 版本太新、Windows 11 兼容性等问题。  
但后来发现，这些都不是根因。

## 排查过程

首先用干净 PATH 测试：

```bat
set PATH=D:\Greensoftware\mingw64\mingw64\bin;C:\Windows\System32;C:\Windows
g++ main.cpp -o main.exe
main.exe
echo %ERRORLEVEL%
```

结果程序正常返回 `0`。

这说明 `g++` 本身没有坏，系统也没问题，真正的问题大概率是：

```text
PATH 污染
```

也就是：  
编译时用的是 `D:\Greensoftware\mingw64` 这套 GCC，但运行 exe 时加载到了别的目录里的 DLL。

接着检查当前环境里能找到哪些 GCC 相关 DLL：

```bat
where g++
where gcc
where libstdc++-6.dll
where libgcc_s_seh-1.dll
where libwinpthread-1.dll
```

结果发现：

```text
where g++
D:\Greensoftware\mingw64\mingw64\bin\g++.exe

where gcc
D:\Greensoftware\mingw64\mingw64\bin\gcc.exe

where libstdc++-6.dll
D:\Software\STM32CubeCLT_1.18.0\STM32CubeProgrammer\bin\libstdc++-6.dll
D:\Greensoftware\mingw64\mingw64\bin\libstdc++-6.dll

where libgcc_s_seh-1.dll
D:\Software\STM32CubeCLT_1.18.0\STM32CubeProgrammer\bin\libgcc_s_seh-1.dll
D:\Greensoftware\mingw64\mingw64\bin\libgcc_s_seh-1.dll

where libwinpthread-1.dll
C:\Program Files (x86)\STMicroelectronics\stlink_server\libwinpthread-1.dll
D:\Software\STM32CubeCLT_1.18.0\STM32CubeProgrammer\bin\libwinpthread-1.dll
D:\Greensoftware\mingw64\mingw64\bin\libwinpthread-1.dll
```

问题基本就定位了。

虽然 `g++` 和 `gcc` 指向的是正确的 MinGW 目录，但运行 exe 时，Windows 会按 DLL 搜索顺序查找动态库。  
由于 STM32CubeProgrammer 的目录排在 MinGW 前面，程序实际加载到了 STM32 那套：

```text
libstdc++-6.dll
libgcc_s_seh-1.dll
```

而不是 `D:\Greensoftware\mingw64` 自己的 DLL。

这就导致了：

```text
编译器 A 编译的程序，运行时加载了工具链 B 的运行库
```

于是出现了“编译成功，但运行直接退出 1”的诡异现象。

## 解决方法

把 PATH 顺序调整了一下，让 MinGW 的 `bin` 目录排在 STM32CubeProgrammer 相关目录之前：

```text
D:\Greensoftware\mingw64\mingw64\bin
```

调整后再次运行：

```bat
where libstdc++-6.dll
where libgcc_s_seh-1.dll
```

确保 MinGW 自己的 DLL 排在前面。

问题随即修复。

## 更推荐的长期做法

这次虽然通过调整 PATH 顺序解决了，但更稳妥的做法是：

不要把多套 MinGW / GCC / STM32 工具链同时塞进全局 PATH。

更好的方式是给不同工具链写独立的启动脚本。

例如 MinGW 16.1.0：

```bat
@echo off
set PATH=D:\Greensoftware\mingw64\mingw64\bin;C:\Windows\System32;C:\Windows
cmd
```

STM32 工具链单独一个：

```bat
@echo off
set PATH=D:\Software\STM32CubeCLT_1.18.0\STM32CubeProgrammer\bin;C:\Program Files (x86)\STMicroelectronics\stlink_server;C:\Windows\System32;C:\Windows
cmd
```

这样不同开发环境之间不会互相抢 DLL。

## 总结

这次问题的根因不是：

```text
Windows 11
GCC 16.1.0
SEH 异常模型
win32 线程模型
C++ 代码本身
```

而是：

```text
PATH 中存在其他工具链的同名运行库 DLL，并且排在当前 MinGW 前面
```

最终结论：

```text
g++ 是对的，gcc 是对的，坏的是运行时 DLL 搜索顺序。
```

以后在 Windows 上同时安装多套 MinGW、STM32、Qt、MSYS2、raylib、Dev-Cpp、CLion 等工具链时，一定要警惕这些文件：

```text
libstdc++-6.dll
libgcc_s_seh-1.dll
libgcc_s_sjlj-1.dll
libgcc_s_dw2-1.dll
libwinpthread-1.dll
libgomp-1.dll
libatomic-1.dll
```

遇到类似“编译没报错，但 exe 一启动就异常退出”的问题，可以先查：

```bat
where g++
where gcc
where libstdc++-6.dll
where libgcc_s_seh-1.dll
where libwinpthread-1.dll
```

很多诡异问题，本质上都是 PATH 污染。