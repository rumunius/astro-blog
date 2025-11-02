---
title: VSCode配置arduino+esp8266开发环境全教程
description: '很详细'
publishDate: 2021-05-09 22:24
tags:
  - 技术
  - 软件
  - 硬件
  - 单片机
  - Arduino
  - ESP系列
  - 配置教程
---

# 前言

你是否觉得ArduinoIDE简陋的简直不像一个IDE，没有代码补全，没有跳转定义，没有实时语法检查，配色也是十分单一？

为什么不试试VSCode呢？

VSCode作为微软出品的一款免费开源的现代化轻量级代码编辑器，拥有丰富的插件生态系统。通过各种插件可以让不是IDE的VSCode媲美IDE。

先来看看配置好了的效果：

![image-20210509193854942](https://i-blog.csdnimg.cn/blog_migrate/75fb9aebbc9bdeedae6ebc970b1aca0c.png)

# 安装ArduinoIDE

> 提示，已经安装ArduinoIDE的读者可以跳过该部分。

虽然VSCode能通过插件做到媲美IDE的效果，但VSCode本质上还是一个代码编辑器，不提供代码的编译、上传等功能。所以VSCode仍需要调用ArduinoIDE内置的工具链和库，实现代码的编译、上传。所以需要安装ArduinoIDE。

前往[Arduino官网](https://www.arduino.cc/en/software)下载ArduinoIDE。

![image-20210509194953282](https://i-blog.csdnimg.cn/blog_migrate/dccfad0e8dc1288427eada1ee3b99653.png)

对于Windows系统，点击`Windows Win 7 and newer`下载。

> **注意：**
>
> 如果看到如下页面，点击`JUST DOWNLOAD`下载。
>
> ![img](https://i-blog.csdnimg.cn/blog_migrate/41b5bd4f9ebb6ef65ef749f8ce1f3f24.jpeg)
>
> > ~~土豪可以考虑捐赠以促进Arduino社区更好地发展~~

下载完成后运行安装包，按照通常安装软件的方法安装ArduinoIDE。

> 如果出现类似`你想安装这个设备软件吗？`的系统提示，不要害怕，这是ArduinoIDE为了让你的电脑正确地识别Arduino开发板而在给你的电脑打驱动，点击`确定`，等待安装完成即可。

安装完成最好打开ArduinoIDE看一下它是否能够正常工作。

> 如果出现防火墙提示，选择`允许访问`，Arduino IDE不会黑掉你的电脑，请放心放行它。

# 获取“项目文件夹”的路径

这是必须的一个步骤。项目文件夹是存放你自己装的第三方库的位置，按如下方法可以获取它的路径，之后会用到它。

打开ArduinoIDE，按<kbd>Ctrl+逗号</kbd>打开首选项。

![image-20210509200647057](https://i-blog.csdnimg.cn/blog_migrate/4b892192de1a87db80268b67e8500a15.png)

可以看到项目文件夹的位置，复制它，之后要用到。

> 笔者的项目文件夹路径曾经自行修改过，可能与你的项目文件夹路径不同。

# 安装ESP8266工具包（可选）

> 如果你有用VSCode开发ESP8266的需求，请阅读此部分

前往[此处](https://pan.baidu.com/s/1CuLBGvVg85WQwzOto-mqgA)（百度网盘，提取码`8266`）下载ESP8266工具包，双击运行，等待一会即完成安装。

# 下载VSCode

打开浏览器前往[VSCode官网](https://code.visualstudio.com/)：

![code.visualstudio.com_](https://i-blog.csdnimg.cn/blog_migrate/af43a4f9040384d9d2d541e21013a413.png)

点击**Download for Windows**按钮下载**VSCode**安装包。

然后一路next下去，安装完成！

> 最好不要安装在C盘

# 优化VSCode

参照我的另一篇文章[《优化VSCode：让你的VSCode变得好用又美观》](https://blog.csdn.net/Cykinter/article/details/113792738)对你的VScode进行优化。

> **如何打开`setting.json`？**
>
> 快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入 **Open Settings (JSON)**。
>
> 即可打开`settings.json`
>
> > 编辑完毕记得保存哦！

> **如何下载插件（又称拓展）？**
>
> 点击侧边的按钮，在搜索框键入插件名称
>
> ![image-20210509194505563](https://i-blog.csdnimg.cn/blog_migrate/dbdc38452ce11a7a0cbe7a7fae06ef2a.png)
>
> 然后点击`安装`（或`Install`）即可安装插件

# 配置VSCode

**这才是重头戏。**

## 安装插件

必须安装以下插件才能愉快地使用VSCode开发Arduino。

![image-20210509202050831](https://i-blog.csdnimg.cn/blog_migrate/8511230c6932b298793108aaf0dc9809.png)

![image-20210509202042010](https://i-blog.csdnimg.cn/blog_migrate/283617318953220dcb78727ba8796caf.png)

## 配置插件

在`settings.json`中加入以下设置项，设置项的意义已经注释：

```json
"C_Cpp.autocompleteAddParentheses": true,//自动补全函数后面的括号
"arduino.path": "你的ArduinoIDE安装目录",//例如，笔者安装在D:盘下Arduino文件夹，所以写D:\\Arduino（注意\要双写）
"arduino.openPDEFiletype": true,//允许打开PDE文件
"arduino.defaultBaudRate": 9600,//设置默认波特率为9600
"arduino.ignoreBoards": [//我的NodeMCU开发板被意外识别为WeMos D1，这个设置可以避免误识别
    "WeMos D1"
],
"arduino.disableIntelliSenseAutoGen": true,//禁用自动生成c_cpp_properties.json
```

## 配置.vscode文件夹

在你喜欢的位置新建一个名为`.vscode`的文件夹（路径最好都不要含有**中文**和**空格**），创建名为`c_cpp_properties.json`的文件。

在该文件内写入如下内容：

```json
{
    "version": 4,
    "configurations": [
        {
            "name": "Arduino",
            "compilerPath": "你的ArduinoIDE安装目录\\hardware\\tools\\avr\\bin\\avr-g++",
            "compilerArgs": [
                "-std=gnu++11",
                "-fpermissive",
                "-fno-exceptions",
                "-ffunction-sections",
                "-fdata-sections",
                "-fno-threadsafe-statics",
                "-Wno-error=narrowing"
            ],
            "intelliSenseMode": "gcc-x64",
            "includePath": [
                "你的ArduinoIDE安装目录\\libraries\\**",
                "项目文件夹路径\\**",
                "你的ArduinoIDE安装目录\\hardware\\arduino\\avr\\**",
                "你的ArduinoIDE安装目录\\hardware\\tools\\avr\\**",
                "你的ArduinoIDE安装目录\\hardware\\arduino\\avr\\libraries\\SPI\\src",
                "${workspaceFolder}"
            ],
            "forcedInclude": [
                "你的ArduinoIDE安装目录\\hardware\\arduino\\avr\\cores\\arduino\\Arduino.h"
            ],
            "cStandard": "c11",
            "cppStandard": "c++11",
            "defines": [
                "F_CPU=16000000L",
                "ARDUINO=10813",
                "ARDUINO_AVR_NANO",
                "ARDUINO_ARCH_AVR",
                "__DBL_MIN_EXP__=(-125)",
                "__HQ_FBIT__=15",
                "__cpp_attributes=200809",
                "__UINT_LEAST16_MAX__=0xffffU",
                "__ATOMIC_ACQUIRE=2",
                "__SFRACT_IBIT__=0",
                "__FLT_MIN__=1.17549435e-38F",
                "__GCC_IEC_559_COMPLEX=0",
                "__BUILTIN_AVR_SLEEP=1",
                "__BUILTIN_AVR_COUNTLSULLK=1",
                "__cpp_aggregate_nsdmi=201304",
                "__BUILTIN_AVR_COUNTLSULLR=1",
                "__UFRACT_MAX__=0XFFFFP-16UR",
                "__UINT_LEAST8_TYPE__=unsigned char",
                "__DQ_FBIT__=63",
                "__INTMAX_C(c)=c ## LL",
                "__ULFRACT_FBIT__=32",
                "__SACCUM_EPSILON__=0x1P-7HK",
                "__CHAR_BIT__=8",
                "__USQ_IBIT__=0",
                "__UINT8_MAX__=0xff",
                "__ACCUM_FBIT__=15",
                "__WINT_MAX__=0x7fff",
                "__FLT32_MIN_EXP__=(-125)",
                "__cpp_static_assert=200410",
                "__USFRACT_FBIT__=8",
                "__ORDER_LITTLE_ENDIAN__=1234",
                "__SIZE_MAX__=0xffffU",
                "__WCHAR_MAX__=0x7fff",
                "__LACCUM_IBIT__=32",
                "__DBL_DENORM_MIN__=double(1.40129846e-45L)",
                "__GCC_ATOMIC_CHAR_LOCK_FREE=1",
                "__GCC_IEC_559=0",
                "__FLT_EVAL_METHOD__=0",
                "__BUILTIN_AVR_LLKBITS=1",
                "__cpp_binary_literals=201304",
                "__LLACCUM_MAX__=0X7FFFFFFFFFFFFFFFP-47LLK",
                "__GCC_ATOMIC_CHAR32_T_LOCK_FREE=1",
                "__BUILTIN_AVR_HKBITS=1",
                "__BUILTIN_AVR_BITSLLK=1",
                "__FRACT_FBIT__=15",
                "__BUILTIN_AVR_BITSLLR=1",
                "__cpp_variadic_templates=200704",
                "__UINT_FAST64_MAX__=0xffffffffffffffffULL",
                "__SIG_ATOMIC_TYPE__=char",
                "__BUILTIN_AVR_UHKBITS=1",
                "__UACCUM_FBIT__=16",
                "__DBL_MIN_10_EXP__=(-37)",
                "__FINITE_MATH_ONLY__=0",
                "__cpp_variable_templates=201304",
                "__LFRACT_IBIT__=0",
                "__GNUC_PATCHLEVEL__=0",
                "__FLT32_HAS_DENORM__=1",
                "__LFRACT_MAX__=0X7FFFFFFFP-31LR",
                "__UINT_FAST8_MAX__=0xff",
                "__has_include(STR)=__has_include__(STR)",
                "__DEC64_MAX_EXP__=385",
                "__INT8_C(c)=c",
                "__INT_LEAST8_WIDTH__=8",
                "__UINT_LEAST64_MAX__=0xffffffffffffffffULL",
                "__SA_FBIT__=15",
                "__SHRT_MAX__=0x7fff",
                "__LDBL_MAX__=3.40282347e+38L",
                "__FRACT_MAX__=0X7FFFP-15R",
                "__UFRACT_FBIT__=16",
                "__UFRACT_MIN__=0.0UR",
                "__UINT_LEAST8_MAX__=0xff",
                "__GCC_ATOMIC_BOOL_LOCK_FREE=1",
                "__UINTMAX_TYPE__=long long unsigned int",
                "__LLFRACT_EPSILON__=0x1P-63LLR",
                "__BUILTIN_AVR_DELAY_CYCLES=1",
                "__DEC32_EPSILON__=1E-6DF",
                "__FLT_EVAL_METHOD_TS_18661_3__=0",
                "__UINT32_MAX__=0xffffffffUL",
                "__GXX_EXPERIMENTAL_CXX0X__=1",
                "__ULFRACT_MAX__=0XFFFFFFFFP-32ULR",
                "__TA_IBIT__=16",
                "__LDBL_MAX_EXP__=128",
                "__WINT_MIN__=(-__WINT_MAX__ - 1)",
                "__INT_LEAST16_WIDTH__=16",
                "__ULLFRACT_MIN__=0.0ULLR",
                "__SCHAR_MAX__=0x7f",
                "__WCHAR_MIN__=(-__WCHAR_MAX__ - 1)",
                "__INT64_C(c)=c ## LL",
                "__DBL_DIG__=6",
                "__GCC_ATOMIC_POINTER_LOCK_FREE=1",
                "__AVR_HAVE_SPH__=1",
                "__LLACCUM_MIN__=(-0X1P15LLK-0X1P15LLK)",
                "__BUILTIN_AVR_KBITS=1",
                "__BUILTIN_AVR_ABSK=1",
                "__BUILTIN_AVR_ABSR=1",
                "__SIZEOF_INT__=2",
                "__SIZEOF_POINTER__=2",
                "__GCC_ATOMIC_CHAR16_T_LOCK_FREE=1",
                "__USACCUM_IBIT__=8",
                "__USER_LABEL_PREFIX__",
                "__STDC_HOSTED__=1",
                "__LDBL_HAS_INFINITY__=1",
                "__LFRACT_MIN__=(-0.5LR-0.5LR)",
                "__HA_IBIT__=8",
                "__FLT32_DIG__=6",
                "__TQ_IBIT__=0",
                "__FLT_EPSILON__=1.19209290e-7F",
                "__GXX_WEAK__=1",
                "__SHRT_WIDTH__=16",
                "__USFRACT_IBIT__=0",
                "__LDBL_MIN__=1.17549435e-38L",
                "__FRACT_MIN__=(-0.5R-0.5R)",
                "__AVR_SFR_OFFSET__=0x20",
                "__DEC32_MAX__=9.999999E96DF",
                "__cpp_threadsafe_static_init=200806",
                "__DA_IBIT__=32",
                "__INT32_MAX__=0x7fffffffL",
                "__UQQ_FBIT__=8",
                "__INT_WIDTH__=16",
                "__SIZEOF_LONG__=4",
                "__UACCUM_MAX__=0XFFFFFFFFP-16UK",
                "__UINT16_C(c)=c ## U",
                "__PTRDIFF_WIDTH__=16",
                "__DECIMAL_DIG__=9",
                "__LFRACT_EPSILON__=0x1P-31LR",
                "__AVR_2_BYTE_PC__=1",
                "__ULFRACT_MIN__=0.0ULR",
                "__INTMAX_WIDTH__=64",
                "__has_include_next(STR)=__has_include_next__(STR)",
                "__BUILTIN_AVR_ULLRBITS=1",
                "__LDBL_HAS_QUIET_NAN__=1",
                "__ULACCUM_IBIT__=32",
                "__UACCUM_EPSILON__=0x1P-16UK",
                "__BUILTIN_AVR_SEI=1",
                "__GNUC__=7",
                "__ULLACCUM_MAX__=0XFFFFFFFFFFFFFFFFP-48ULLK",
                "__cpp_delegating_constructors=200604",
                "__HQ_IBIT__=0",
                "__BUILTIN_AVR_SWAP=1",
                "__FLT_HAS_DENORM__=1",
                "__SIZEOF_LONG_DOUBLE__=4",
                "__BIGGEST_ALIGNMENT__=1",
                "__STDC_UTF_16__=1",
                "__UINT24_MAX__=16777215UL",
                "__BUILTIN_AVR_NOP=1",
                "__GNUC_STDC_INLINE__=1",
                "__DQ_IBIT__=0",
                "__FLT32_HAS_INFINITY__=1",
                "__DBL_MAX__=double(3.40282347e+38L)",
                "__ULFRACT_IBIT__=0",
                "__cpp_raw_strings=200710",
                "__INT_FAST32_MAX__=0x7fffffffL",
                "__DBL_HAS_INFINITY__=1",
                "__INT64_MAX__=0x7fffffffffffffffLL",
                "__ACCUM_IBIT__=16",
                "__DEC32_MIN_EXP__=(-94)",
                "__BUILTIN_AVR_UKBITS=1",
                "__INTPTR_WIDTH__=16",
                "__BUILTIN_AVR_FMULSU=1",
                "__LACCUM_MAX__=0X7FFFFFFFFFFFFFFFP-31LK",
                "__INT_FAST16_TYPE__=int",
                "__LDBL_HAS_DENORM__=1",
                "__BUILTIN_AVR_BITSK=1",
                "__BUILTIN_AVR_BITSR=1",
                "__cplusplus=201103L",
                "__cpp_ref_qualifiers=200710",
                "__DEC128_MAX__=9.999999999999999999999999999999999E6144DL",
                "__INT_LEAST32_MAX__=0x7fffffffL",
                "__USING_SJLJ_EXCEPTIONS__=1",
                "__DEC32_MIN__=1E-95DF",
                "__ACCUM_MAX__=0X7FFFFFFFP-15K",
                "__DEPRECATED=1",
                "__cpp_rvalue_references=200610",
                "__DBL_MAX_EXP__=128",
                "__USACCUM_EPSILON__=0x1P-8UHK",
                "__WCHAR_WIDTH__=16",
                "__FLT32_MAX__=3.40282347e+38F32",
                "__DEC128_EPSILON__=1E-33DL",
                "__SFRACT_MAX__=0X7FP-7HR",
                "__FRACT_IBIT__=0",
                "__PTRDIFF_MAX__=0x7fff",
                "__UACCUM_MIN__=0.0UK",
                "__UACCUM_IBIT__=16",
                "__BUILTIN_AVR_NOPS=1",
                "__BUILTIN_AVR_WDR=1",
                "__FLT32_HAS_QUIET_NAN__=1",
                "__GNUG__=7",
                "__LONG_LONG_MAX__=0x7fffffffffffffffLL",
                "__SIZEOF_SIZE_T__=2",
                "__ULACCUM_MAX__=0XFFFFFFFFFFFFFFFFP-32ULK",
                "__cpp_rvalue_reference=200610",
                "__cpp_nsdmi=200809",
                "__SIZEOF_WINT_T__=2",
                "__LONG_LONG_WIDTH__=64",
                "__cpp_initializer_lists=200806",
                "__FLT32_MAX_EXP__=128",
                "__SA_IBIT__=16",
                "__ULLACCUM_MIN__=0.0ULLK",
                "__BUILTIN_AVR_ROUNDUHK=1",
                "__BUILTIN_AVR_ROUNDUHR=1",
                "__cpp_hex_float=201603",
                "__GXX_ABI_VERSION=1011",
                "__INT24_MAX__=8388607L",
                "__UTA_FBIT__=48",
                "__FLT_MIN_EXP__=(-125)",
                "__USFRACT_MAX__=0XFFP-8UHR",
                "__UFRACT_IBIT__=0",
                "__BUILTIN_AVR_ROUNDFX=1",
                "__BUILTIN_AVR_ROUNDULK=1",
                "__BUILTIN_AVR_ROUNDULR=1",
                "__cpp_lambdas=200907",
                "__BUILTIN_AVR_COUNTLSLLK=1",
                "__BUILTIN_AVR_COUNTLSLLR=1",
                "__BUILTIN_AVR_ROUNDHK=1",
                "__INT_FAST64_TYPE__=long long int",
                "__BUILTIN_AVR_ROUNDHR=1",
                "__DBL_MIN__=double(1.17549435e-38L)",
                "__BUILTIN_AVR_COUNTLSK=1",
                "__BUILTIN_AVR_ROUNDLK=1",
                "__BUILTIN_AVR_COUNTLSR=1",
                "__BUILTIN_AVR_ROUNDLR=1",
                "__LACCUM_MIN__=(-0X1P31LK-0X1P31LK)",
                "__ULLACCUM_FBIT__=48",
                "__BUILTIN_AVR_LKBITS=1",
                "__ULLFRACT_EPSILON__=0x1P-64ULLR",
                "__DEC128_MIN__=1E-6143DL",
                "__REGISTER_PREFIX__",
                "__UINT16_MAX__=0xffffU",
                "__DBL_HAS_DENORM__=1",
                "__BUILTIN_AVR_ULKBITS=1",
                "__ACCUM_MIN__=(-0X1P15K-0X1P15K)",
                "__AVR_ARCH__=2",
                "__SQ_IBIT__=0",
                "__FLT32_MIN__=1.17549435e-38F32",
                "__UINT8_TYPE__=unsigned char",
                "__BUILTIN_AVR_ROUNDUK=1",
                "__BUILTIN_AVR_ROUNDUR=1",
                "__UHA_FBIT__=8",
                "__NO_INLINE__=1",
                "__SFRACT_MIN__=(-0.5HR-0.5HR)",
                "__UTQ_FBIT__=128",
                "__FLT_MANT_DIG__=24",
                "__LDBL_DECIMAL_DIG__=9",
                "__VERSION__=\"7.3.0\"",
                "__UINT64_C(c)=c ## ULL",
                "__ULLFRACT_FBIT__=64",
                "__cpp_unicode_characters=200704",
                "__FRACT_EPSILON__=0x1P-15R",
                "__ULACCUM_MIN__=0.0ULK",
                "__UDA_FBIT__=32",
                "__cpp_decltype_auto=201304",
                "__LLACCUM_EPSILON__=0x1P-47LLK",
                "__GCC_ATOMIC_INT_LOCK_FREE=1",
                "__FLT32_MANT_DIG__=24",
                "__BUILTIN_AVR_BITSUHK=1",
                "__BUILTIN_AVR_BITSUHR=1",
                "__FLOAT_WORD_ORDER__=__ORDER_LITTLE_ENDIAN__",
                "__USFRACT_MIN__=0.0UHR",
                "__BUILTIN_AVR_BITSULK=1",
                "__ULLACCUM_IBIT__=16",
                "__BUILTIN_AVR_BITSULR=1",
                "__UQQ_IBIT__=0",
                "__BUILTIN_AVR_LLRBITS=1",
                "__SCHAR_WIDTH__=8",
                "__BUILTIN_AVR_BITSULLK=1",
                "__BUILTIN_AVR_BITSULLR=1",
                "__INT32_C(c)=c ## L",
                "__DEC64_EPSILON__=1E-15DD",
                "__ORDER_PDP_ENDIAN__=3412",
                "__DEC128_MIN_EXP__=(-6142)",
                "__UHQ_FBIT__=16",
                "__LLACCUM_FBIT__=47",
                "__FLT32_MAX_10_EXP__=38",
                "__BUILTIN_AVR_ROUNDULLK=1",
                "__BUILTIN_AVR_ROUNDULLR=1",
                "__INT_FAST32_TYPE__=long int",
                "__BUILTIN_AVR_HRBITS=1",
                "__UINT_LEAST16_TYPE__=unsigned int",
                "__BUILTIN_AVR_UHRBITS=1",
                "__INT16_MAX__=0x7fff",
                "__SIZE_TYPE__=unsigned int",
                "__UINT64_MAX__=0xffffffffffffffffULL",
                "__UDQ_FBIT__=64",
                "__INT8_TYPE__=signed char",
                "__cpp_digit_separators=201309",
                "__ELF__=1",
                "__ULFRACT_EPSILON__=0x1P-32ULR",
                "__LLFRACT_FBIT__=63",
                "__FLT_RADIX__=2",
                "__INT_LEAST16_TYPE__=int",
                "__BUILTIN_AVR_ABSFX=1",
                "__LDBL_EPSILON__=1.19209290e-7L",
                "__UINTMAX_C(c)=c ## ULL",
                "__INT24_MIN__=(-__INT24_MAX__-1)",
                "__SACCUM_MAX__=0X7FFFP-7HK",
                "__BUILTIN_AVR_ABSHR=1",
                "__SIG_ATOMIC_MAX__=0x7f",
                "__GCC_ATOMIC_WCHAR_T_LOCK_FREE=1",
                "__cpp_sized_deallocation=201309",
                "__SIZEOF_PTRDIFF_T__=2",
                "__AVR=1",
                "__BUILTIN_AVR_ABSLK=1",
                "__BUILTIN_AVR_ABSLR=1",
                "__LACCUM_EPSILON__=0x1P-31LK",
                "__DEC32_SUBNORMAL_MIN__=0.000001E-95DF",
                "__INT_FAST16_MAX__=0x7fff",
                "__UINT_FAST32_MAX__=0xffffffffUL",
                "__UINT_LEAST64_TYPE__=long long unsigned int",
                "__USACCUM_MAX__=0XFFFFP-8UHK",
                "__SFRACT_EPSILON__=0x1P-7HR",
                "__FLT_HAS_QUIET_NAN__=1",
                "__FLT_MAX_10_EXP__=38",
                "__LONG_MAX__=0x7fffffffL",
                "__DEC128_SUBNORMAL_MIN__=0.000000000000000000000000000000001E-6143DL",
                "__FLT_HAS_INFINITY__=1",
                "__cpp_unicode_literals=200710",
                "__USA_FBIT__=16",
                "__UINT_FAST16_TYPE__=unsigned int",
                "__DEC64_MAX__=9.999999999999999E384DD",
                "__INT_FAST32_WIDTH__=32",
                "__BUILTIN_AVR_RBITS=1",
                "__CHAR16_TYPE__=unsigned int",
                "__PRAGMA_REDEFINE_EXTNAME=1",
                "__SIZE_WIDTH__=16",
                "__INT_LEAST16_MAX__=0x7fff",
                "__DEC64_MANT_DIG__=16",
                "__UINT_LEAST32_MAX__=0xffffffffUL",
                "__SACCUM_FBIT__=7",
                "__FLT32_DENORM_MIN__=1.40129846e-45F32",
                "__GCC_ATOMIC_LONG_LOCK_FREE=1",
                "__SIG_ATOMIC_WIDTH__=8",
                "__INT_LEAST64_TYPE__=long long int",
                "__INT16_TYPE__=int",
                "__INT_LEAST8_TYPE__=signed char",
                "__SQ_FBIT__=31",
                "__DEC32_MAX_EXP__=97",
                "__INT_FAST8_MAX__=0x7f",
                "__INTPTR_MAX__=0x7fff",
                "__QQ_FBIT__=7",
                "__cpp_range_based_for=200907",
                "__UTA_IBIT__=16",
                "__AVR_ERRATA_SKIP__=1",
                "__FLT32_MIN_10_EXP__=(-37)",
                "__LDBL_MANT_DIG__=24",
                "__SFRACT_FBIT__=7",
                "__SACCUM_MIN__=(-0X1P7HK-0X1P7HK)",
                "__DBL_HAS_QUIET_NAN__=1",
                "__SIG_ATOMIC_MIN__=(-__SIG_ATOMIC_MAX__ - 1)",
                "AVR=1",
                "__BUILTIN_AVR_FMULS=1",
                "__cpp_return_type_deduction=201304",
                "__INTPTR_TYPE__=int",
                "__UINT16_TYPE__=unsigned int",
                "__WCHAR_TYPE__=int",
                "__SIZEOF_FLOAT__=4",
                "__AVR__=1",
                "__BUILTIN_AVR_INSERT_BITS=1",
                "__USQ_FBIT__=32",
                "__UINTPTR_MAX__=0xffffU",
                "__INT_FAST64_WIDTH__=64",
                "__DEC64_MIN_EXP__=(-382)",
                "__cpp_decltype=200707",
                "__FLT32_DECIMAL_DIG__=9",
                "__INT_FAST64_MAX__=0x7fffffffffffffffLL",
                "__GCC_ATOMIC_TEST_AND_SET_TRUEVAL=1",
                "__FLT_DIG__=6",
                "__UINT_FAST64_TYPE__=long long unsigned int",
                "__BUILTIN_AVR_BITSHK=1",
                "__BUILTIN_AVR_BITSHR=1",
                "__INT_MAX__=0x7fff",
                "__LACCUM_FBIT__=31",
                "__USACCUM_MIN__=0.0UHK",
                "__UHA_IBIT__=8",
                "__INT64_TYPE__=long long int",
                "__BUILTIN_AVR_BITSLK=1",
                "__BUILTIN_AVR_BITSLR=1",
                "__FLT_MAX_EXP__=128",
                "__UTQ_IBIT__=0",
                "__DBL_MANT_DIG__=24",
                "__cpp_inheriting_constructors=201511",
                "__BUILTIN_AVR_ULLKBITS=1",
                "__INT_LEAST64_MAX__=0x7fffffffffffffffLL",
                "__DEC64_MIN__=1E-383DD",
                "__WINT_TYPE__=int",
                "__UINT_LEAST32_TYPE__=long unsigned int",
                "__SIZEOF_SHORT__=2",
                "__ULLFRACT_IBIT__=0",
                "__LDBL_MIN_EXP__=(-125)",
                "__UDA_IBIT__=32",
                "__WINT_WIDTH__=16",
                "__INT_LEAST8_MAX__=0x7f",
                "__LFRACT_FBIT__=31",
                "__LDBL_MAX_10_EXP__=38",
                "__ATOMIC_RELAXED=0",
                "__DBL_EPSILON__=double(1.19209290e-7L)",
                "__BUILTIN_AVR_BITSUK=1",
                "__BUILTIN_AVR_BITSUR=1",
                "__UINT8_C(c)=c",
                "__INT_LEAST32_TYPE__=long int",
                "__BUILTIN_AVR_URBITS=1",
                "__SIZEOF_WCHAR_T__=2",
                "__LLFRACT_MAX__=0X7FFFFFFFFFFFFFFFP-63LLR",
                "__TQ_FBIT__=127",
                "__INT_FAST8_TYPE__=signed char",
                "__ULLACCUM_EPSILON__=0x1P-48ULLK",
                "__BUILTIN_AVR_ROUNDK=1",
                "__BUILTIN_AVR_ROUNDR=1",
                "__UHQ_IBIT__=0",
                "__LLACCUM_IBIT__=16",
                "__FLT32_EPSILON__=1.19209290e-7F32",
                "__DBL_DECIMAL_DIG__=9",
                "__STDC_UTF_32__=1",
                "__INT_FAST8_WIDTH__=8",
                "__DEC_EVAL_METHOD__=2",
                "__TA_FBIT__=47",
                "__UDQ_IBIT__=0",
                "__ORDER_BIG_ENDIAN__=4321",
                "__cpp_runtime_arrays=198712",
                "__WITH_AVRLIBC__=1",
                "__UINT64_TYPE__=long long unsigned int",
                "__ACCUM_EPSILON__=0x1P-15K",
                "__UINT32_C(c)=c ## UL",
                "__BUILTIN_AVR_COUNTLSUHK=1",
                "__INTMAX_MAX__=0x7fffffffffffffffLL",
                "__cpp_alias_templates=200704",
                "__BUILTIN_AVR_COUNTLSUHR=1",
                "__BYTE_ORDER__=__ORDER_LITTLE_ENDIAN__",
                "__FLT_DENORM_MIN__=1.40129846e-45F",
                "__LLFRACT_IBIT__=0",
                "__INT8_MAX__=0x7f",
                "__LONG_WIDTH__=32",
                "__UINT_FAST32_TYPE__=long unsigned int",
                "__CHAR32_TYPE__=long unsigned int",
                "__BUILTIN_AVR_COUNTLSULK=1",
                "__BUILTIN_AVR_COUNTLSULR=1",
                "__FLT_MAX__=3.40282347e+38F",
                "__cpp_constexpr=201304",
                "__USACCUM_FBIT__=8",
                "__BUILTIN_AVR_COUNTLSFX=1",
                "__INT32_TYPE__=long int",
                "__SIZEOF_DOUBLE__=4",
                "__FLT_MIN_10_EXP__=(-37)",
                "__UFRACT_EPSILON__=0x1P-16UR",
                "__INT_LEAST32_WIDTH__=32",
                "__BUILTIN_AVR_COUNTLSHK=1",
                "__BUILTIN_AVR_COUNTLSHR=1",
                "__INTMAX_TYPE__=long long int",
                "__BUILTIN_AVR_ABSLLK=1",
                "__BUILTIN_AVR_ABSLLR=1",
                "__DEC128_MAX_EXP__=6145",
                "__AVR_HAVE_16BIT_SP__=1",
                "__ATOMIC_CONSUME=1",
                "__GNUC_MINOR__=3",
                "__INT_FAST16_WIDTH__=16",
                "__UINTMAX_MAX__=0xffffffffffffffffULL",
                "__DEC32_MANT_DIG__=7",
                "__HA_FBIT__=7",
                "__BUILTIN_AVR_COUNTLSLK=1",
                "__BUILTIN_AVR_COUNTLSLR=1",
                "__BUILTIN_AVR_CLI=1",
                "__DBL_MAX_10_EXP__=38",
                "__LDBL_DENORM_MIN__=1.40129846e-45L",
                "__INT16_C(c)=c",
                "__cpp_generic_lambdas=201304",
                "__STDC__=1",
                "__PTRDIFF_TYPE__=int",
                "__LLFRACT_MIN__=(-0.5LLR-0.5LLR)",
                "__BUILTIN_AVR_LRBITS=1",
                "__ATOMIC_SEQ_CST=5",
                "__DA_FBIT__=31",
                "__UINT32_TYPE__=long unsigned int",
                "__BUILTIN_AVR_ROUNDLLK=1",
                "__UINTPTR_TYPE__=unsigned int",
                "__BUILTIN_AVR_ROUNDLLR=1",
                "__USA_IBIT__=16",
                "__BUILTIN_AVR_ULRBITS=1",
                "__DEC64_SUBNORMAL_MIN__=0.000000000000001E-383DD",
                "__DEC128_MANT_DIG__=34",
                "__LDBL_MIN_10_EXP__=(-37)",
                "__BUILTIN_AVR_COUNTLSUK=1",
                "__BUILTIN_AVR_COUNTLSUR=1",
                "__SIZEOF_LONG_LONG__=8",
                "__ULACCUM_EPSILON__=0x1P-32ULK",
                "__cpp_user_defined_literals=200809",
                "__SACCUM_IBIT__=8",
                "__GCC_ATOMIC_LLONG_LOCK_FREE=1",
                "__LDBL_DIG__=6",
                "__FLT_DECIMAL_DIG__=9",
                "__UINT_FAST16_MAX__=0xffffU",
                "__GCC_ATOMIC_SHORT_LOCK_FREE=1",
                "__BUILTIN_AVR_ABSHK=1",
                "__BUILTIN_AVR_FLASH_SEGMENT=1",
                "__INT_LEAST64_WIDTH__=64",
                "__ULLFRACT_MAX__=0XFFFFFFFFFFFFFFFFP-64ULLR",
                "__UINT_FAST8_TYPE__=unsigned char",
                "__USFRACT_EPSILON__=0x1P-8UHR",
                "__ULACCUM_FBIT__=32",
                "__QQ_IBIT__=0",
                "__cpp_init_captures=201304",
                "__ATOMIC_ACQ_REL=4",
                "__ATOMIC_RELEASE=3",
                "__BUILTIN_AVR_FMUL=1",
                "USBCON"
            ]
        }/*,
        {
            "name": "ESP8266",
            "compilerPath": "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\bin\\xtensa-lx106-elf-g++",
            "compilerArgs": [
                "-U__STRICT_ANSI__",
                "-w",
                "-mlongcalls",
                "-mtext-section-literals",
                "-fno-rtti",
                "-falign-functions=4",
                "-std=gnu++11"
            ],
            "intelliSenseMode": "gcc-x64",
            "includePath": [
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\tools\\sdk\\include",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\tools\\sdk\\lwip2\\include",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\tools\\sdk\\libc\\xtensa-lx106-elf\\include",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\cores\\esp8266",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\variants\\nodemcu",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\libraries\\ESP8266WebServer\\src",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\libraries\\ESP8266WiFi\\src",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\libraries\\ArduinoOTA",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\libraries\\ESP8266mDNS\\src",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\xtensa-lx106-elf\\include\\c++\\4.8.2",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\xtensa-lx106-elf\\include\\c++\\4.8.2\\xtensa-lx106-elf",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\xtensa-lx106-elf\\include\\c++\\4.8.2\\backward",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\lib\\gcc\\xtensa-lx106-elf\\4.8.2\\include",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\lib\\gcc\\xtensa-lx106-elf\\4.8.2\\include-fixed",
                "c:\\users\\你的用户名\\appdata\\local\\arduino15\\packages\\esp8266\\tools\\xtensa-lx106-elf-gcc\\2.5.0-4-b40a506\\xtensa-lx106-elf\\include",
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\libraries\\**",
                "项目文件夹路径\\**",
                "${workspaceFolder}"
            ],
            "forcedInclude": [
                "C:\\Users\\你的用户名\\AppData\\Local\\Arduino15\\packages\\esp8266\\hardware\\esp8266\\2.7.4\\cores\\esp8266\\Arduino.h"
            ],
            "cStandard": "c11",
            "cppStandard": "c++11",
            "defines": [
                "__ets__",
                "ICACHE_FLASH",
                "NONOSDK22x_190703=1",
                "F_CPU=80000000L",
                "LWIP_OPEN_SRC",
                "TCP_MSS=536",
                "LWIP_FEATURES=1",
                "LWIP_IPV6=0",
                "ARDUINO=10813",
                "ARDUINO_ESP8266_NODEMCU",
                "ARDUINO_ARCH_ESP8266",
                "ARDUINO_BOARD=\"ESP8266_NODEMCU\"",
                "LED_BUILTIN=2",
                "FLASHMODE_DIO",
                "ESP8266",
                "__DBL_MIN_EXP__=(-1021)",
                "__UINT_LEAST16_MAX__=65535",
                "__ATOMIC_ACQUIRE=2",
                "__FLT_MIN__=1.1754943508222875e-38F",
                "__UINT_LEAST8_TYPE__=unsigned char",
                "__INTMAX_C(c)=c ## LL",
                "__CHAR_BIT__=8",
                "__UINT8_MAX__=255",
                "__WINT_MAX__=4294967295U",
                "__ORDER_LITTLE_ENDIAN__=1234",
                "__SIZE_MAX__=4294967295U",
                "__WCHAR_MAX__=65535",
                "__DBL_DENORM_MIN__=double(4.9406564584124654e-324L)",
                "__GCC_ATOMIC_CHAR_LOCK_FREE=1",
                "__FLT_EVAL_METHOD__=0",
                "__GCC_ATOMIC_CHAR32_T_LOCK_FREE=1",
                "__UINT_FAST64_MAX__=18446744073709551615ULL",
                "__SIG_ATOMIC_TYPE__=int",
                "__DBL_MIN_10_EXP__=(-307)",
                "__FINITE_MATH_ONLY__=0",
                "__GNUC_PATCHLEVEL__=2",
                "__UINT_FAST8_MAX__=4294967295U",
                "__DEC64_MAX_EXP__=385",
                "__INT8_C(c)=c",
                "__UINT_LEAST64_MAX__=18446744073709551615ULL",
                "__SHRT_MAX__=32767",
                "__LDBL_MAX__=1.7976931348623157e+308L",
                "__UINT_LEAST8_MAX__=255",
                "__GCC_ATOMIC_BOOL_LOCK_FREE=1",
                "__UINTMAX_TYPE__=long long unsigned int",
                "__DEC32_EPSILON__=1E-6DF",
                "__CHAR_UNSIGNED__=1",
                "__UINT32_MAX__=4294967295UL",
                "__LDBL_MAX_EXP__=1024",
                "__WINT_MIN__=0U",
                "__SCHAR_MAX__=127",
                "__WCHAR_MIN__=0",
                "__INT64_C(c)=c ## LL",
                "__DBL_DIG__=15",
                "__GCC_ATOMIC_POINTER_LOCK_FREE=1",
                "__XTENSA_CALL0_ABI__=1",
                "__SIZEOF_INT__=4",
                "__SIZEOF_POINTER__=4",
                "__GCC_ATOMIC_CHAR16_T_LOCK_FREE=1",
                "__USER_LABEL_PREFIX__",
                "__STDC_HOSTED__=1",
                "__LDBL_HAS_INFINITY__=1",
                "__XTENSA_EL__=1",
                "__FLT_EPSILON__=1.1920928955078125e-7F",
                "__GXX_WEAK__=1",
                "__LDBL_MIN__=2.2250738585072014e-308L",
                "__DEC32_MAX__=9.999999E96DF",
                "__INT32_MAX__=2147483647L",
                "__SIZEOF_LONG__=4",
                "__UINT16_C(c)=c",
                "__DECIMAL_DIG__=17",
                "__LDBL_HAS_QUIET_NAN__=1",
                "__GNUC__=4",
                "__GXX_RTTI=1",
                "__FLT_HAS_DENORM__=1",
                "__SIZEOF_LONG_DOUBLE__=8",
                "__BIGGEST_ALIGNMENT__=16",
                "__DBL_MAX__=double(1.7976931348623157e+308L)",
                "__INT_FAST32_MAX__=2147483647",
                "__DBL_HAS_INFINITY__=1",
                "__INT64_MAX__=9223372036854775807LL",
                "__DEC32_MIN_EXP__=(-94)",
                "__INT_FAST16_TYPE__=int",
                "__LDBL_HAS_DENORM__=1",
                "__cplusplus=201103L",
                "__DEC128_MAX__=9.999999999999999999999999999999999E6144DL",
                "__INT_LEAST32_MAX__=2147483647L",
                "__DEC32_MIN__=1E-95DF",
                "__DEPRECATED=1",
                "__DBL_MAX_EXP__=1024",
                "__DEC128_EPSILON__=1E-33DL",
                "__PTRDIFF_MAX__=2147483647",
                "__GNUG__=4",
                "__LONG_LONG_MAX__=9223372036854775807LL",
                "__SIZEOF_SIZE_T__=4",
                "__SIZEOF_WINT_T__=4",
                "__GXX_ABI_VERSION=1002",
                "__FLT_MIN_EXP__=(-125)",
                "__INT_FAST64_TYPE__=long long int",
                "__DBL_MIN__=double(2.2250738585072014e-308L)",
                "__FLT_MIN_10_EXP__=(-37)",
                "__DEC128_MIN__=1E-6143DL",
                "__REGISTER_PREFIX__",
                "__UINT16_MAX__=65535",
                "__DBL_HAS_DENORM__=1",
                "__UINT8_TYPE__=unsigned char",
                "__NO_INLINE__=1",
                "__FLT_MANT_DIG__=24",
                "__VERSION__=\"4.8.2\"",
                "__UINT64_C(c)=c ## ULL",
                "__XTENSA_SOFT_FLOAT__=1",
                "__GCC_ATOMIC_INT_LOCK_FREE=1",
                "__FLOAT_WORD_ORDER__=__ORDER_LITTLE_ENDIAN__",
                "__INT32_C(c)=c ## L",
                "__DEC64_EPSILON__=1E-15DD",
                "__ORDER_PDP_ENDIAN__=3412",
                "__DEC128_MIN_EXP__=(-6142)",
                "__INT_FAST32_TYPE__=int",
                "__UINT_LEAST16_TYPE__=short unsigned int",
                "__INT16_MAX__=32767",
                "__SIZE_TYPE__=unsigned int",
                "__UINT64_MAX__=18446744073709551615ULL",
                "__INT8_TYPE__=signed char",
                "__ELF__=1",
                "__xtensa__=1",
                "__FLT_RADIX__=2",
                "__INT_LEAST16_TYPE__=short int",
                "__LDBL_EPSILON__=2.2204460492503131e-16L",
                "__UINTMAX_C(c)=c ## ULL",
                "__SIG_ATOMIC_MAX__=2147483647",
                "__GCC_ATOMIC_WCHAR_T_LOCK_FREE=1",
                "__SIZEOF_PTRDIFF_T__=4",
                "__DEC32_SUBNORMAL_MIN__=0.000001E-95DF",
                "__INT_FAST16_MAX__=2147483647",
                "__UINT_FAST32_MAX__=4294967295U",
                "__UINT_LEAST64_TYPE__=long long unsigned int",
                "__FLT_HAS_QUIET_NAN__=1",
                "__FLT_MAX_10_EXP__=38",
                "__LONG_MAX__=2147483647L",
                "__DEC128_SUBNORMAL_MIN__=0.000000000000000000000000000000001E-6143DL",
                "__FLT_HAS_INFINITY__=1",
                "__UINT_FAST16_TYPE__=unsigned int",
                "__DEC64_MAX__=9.999999999999999E384DD",
                "__CHAR16_TYPE__=short unsigned int",
                "__PRAGMA_REDEFINE_EXTNAME=1",
                "__INT_LEAST16_MAX__=32767",
                "__DEC64_MANT_DIG__=16",
                "__UINT_LEAST32_MAX__=4294967295UL",
                "__GCC_ATOMIC_LONG_LOCK_FREE=1",
                "__INT_LEAST64_TYPE__=long long int",
                "__INT16_TYPE__=short int",
                "__INT_LEAST8_TYPE__=signed char",
                "__DEC32_MAX_EXP__=97",
                "__INT_FAST8_MAX__=2147483647",
                "__INTPTR_MAX__=2147483647",
                "__EXCEPTIONS=1",
                "__LDBL_MANT_DIG__=53",
                "__DBL_HAS_QUIET_NAN__=1",
                "__SIG_ATOMIC_MIN__=(-__SIG_ATOMIC_MAX__ - 1)",
                "__INTPTR_TYPE__=int",
                "__UINT16_TYPE__=short unsigned int",
                "__WCHAR_TYPE__=short unsigned int",
                "__SIZEOF_FLOAT__=4",
                "__UINTPTR_MAX__=4294967295U",
                "__DEC64_MIN_EXP__=(-382)",
                "__INT_FAST64_MAX__=9223372036854775807LL",
                "__GCC_ATOMIC_TEST_AND_SET_TRUEVAL=1",
                "__FLT_DIG__=6",
                "__UINT_FAST64_TYPE__=long long unsigned int",
                "__INT_MAX__=2147483647",
                "__INT64_TYPE__=long long int",
                "__FLT_MAX_EXP__=128",
                "__DBL_MANT_DIG__=53",
                "__INT_LEAST64_MAX__=9223372036854775807LL",
                "__DEC64_MIN__=1E-383DD",
                "__WINT_TYPE__=unsigned int",
                "__UINT_LEAST32_TYPE__=long unsigned int",
                "__SIZEOF_SHORT__=2",
                "__LDBL_MIN_EXP__=(-1021)",
                "__INT_LEAST8_MAX__=127",
                "__WCHAR_UNSIGNED__=1",
                "__LDBL_MAX_10_EXP__=308",
                "__ATOMIC_RELAXED=0",
                "__DBL_EPSILON__=double(2.2204460492503131e-16L)",
                "__UINT8_C(c)=c",
                "__INT_LEAST32_TYPE__=long int",
                "__SIZEOF_WCHAR_T__=2",
                "__UINT64_TYPE__=long long unsigned int",
                "__INT_FAST8_TYPE__=int",
                "__DBL_DECIMAL_DIG__=17",
                "__DEC_EVAL_METHOD__=2",
                "__XTENSA__=1",
                "__ORDER_BIG_ENDIAN__=4321",
                "__UINT32_C(c)=c ## UL",
                "__INTMAX_MAX__=9223372036854775807LL",
                "__BYTE_ORDER__=__ORDER_LITTLE_ENDIAN__",
                "__FLT_DENORM_MIN__=1.4012984643248171e-45F",
                "__INT8_MAX__=127",
                "__UINT_FAST32_TYPE__=unsigned int",
                "__CHAR32_TYPE__=long unsigned int",
                "__FLT_MAX__=3.4028234663852886e+38F",
                "__INT32_TYPE__=long int",
                "__SIZEOF_DOUBLE__=8",
                "__INTMAX_TYPE__=long long int",
                "__DEC128_MAX_EXP__=6145",
                "__ATOMIC_CONSUME=1",
                "__GNUC_MINOR__=8",
                "__UINTMAX_MAX__=18446744073709551615ULL",
                "__DEC32_MANT_DIG__=7",
                "__DBL_MAX_10_EXP__=308",
                "__LDBL_DENORM_MIN__=4.9406564584124654e-324L",
                "__INT16_C(c)=c",
                "__STDC__=1",
                "__PTRDIFF_TYPE__=int",
                "__ATOMIC_SEQ_CST=5",
                "__UINT32_TYPE__=long unsigned int",
                "__UINTPTR_TYPE__=unsigned int",
                "__DEC64_SUBNORMAL_MIN__=0.000000000000001E-383DD",
                "__DEC128_MANT_DIG__=34",
                "__LDBL_MIN_10_EXP__=(-307)",
                "__SIZEOF_LONG_LONG__=8",
                "__GCC_ATOMIC_LLONG_LOCK_FREE=1",
                "__LDBL_DIG__=15",
                "__FLT_DECIMAL_DIG__=9",
                "__UINT_FAST16_MAX__=4294967295U",
                "__GNUC_GNU_INLINE__=1",
                "__GCC_ATOMIC_SHORT_LOCK_FREE=1",
                "__UINT_FAST8_TYPE__=unsigned int",
                "__ATOMIC_ACQ_REL=4",
                "__ATOMIC_RELEASE=3"
            ]
        }*/
        /*如果你有使用VSCode开发ESP8266的需求，请取消上面那一大块代码的注释，否则删除上面那些被注释的代码。但无论如何，请删除这条注释。*/
    ]
}
```

> 请注意替换代码中的中文提示为你自己的值，比如“你的ArduinoIDE安装目录”或是“项目文件夹路径”

在`.vscode`文件夹下创建名为`arduino.json`的文件。

在该文件内写入如下内容：

```json
{
    "output": "BuildTempFile"
}
```

> 即设置编译缓存

至此，将`.vscode`文件夹备份一份存在别的地方，以后新建工程时会用到。

**总算配置完成了！**

# 使用VSCode开发arduino/esp8266

## 工程

在使用ArduinoIDE开发Arduino的时候，你会发现，一个**工程**总是位于一个**目录**下，否则无法正常编译工程，且目录结构通常像是下面这样：

```
xxx
|--xxx.ino（工程本体，与目录同名）
|--aaa.cpp
\--bbb.h
（如果是多文件工程还会有像上面这样的.cpp和.h文件）
```

在VSCode中开发Arduino，也有类似“工程”的概念。一个**工程**总是位于一个**目录**下，否则无法正常编译工程，且目录结构通常像是下面这样：

```
xxx
|--.vscode
|  |--arduino.json
|  \--c_cpp_properties.json
|--xxx.ino（工程本体，与目录同名）
|--BuildTempFile（如果设置了编译缓存则会有这个文件夹，里面内容很杂，这里省略）
|--aaa.cpp
\--bbb.h
（如果是多文件工程还会有像上面这样的.cpp和.h文件）
```

## 新建工程

在磁盘上你喜欢的位置新建一个文件夹（路径及名字最好都不要含有**中文**和**空格**），此文件夹即为你的**工程目录**，此文件夹的名称即为你的**工程名**。

将之前备份好的`.vscode`文件复制一份到**工程目录**下。

在**工程目录**下，新建名为`工程名.ino`（注意替换“工程名”三个字为你真正的工程名）的文件，此文件即为你工程的**工程主文件**。

至此，你便完成了新建工程的工作。

## 打开工程

有两种方式打开一个工程。

### 第一种方式

在文件资源管理器中，在工程文件夹界面的空白处右键，点击`通过 Code 打开`，即可打开工程。

![image-20210509211156601](https://i-blog.csdnimg.cn/blog_migrate/d0680482c3ce6bca9fcd2760053dd56d.png)

### 第二种方式

先启动VSCode，点击菜单栏文件->打开文件夹…或<kbd>Ctrl+K Ctrl+O</kbd>，在弹出的界面中选择工程文件夹，点击“打开”即可打开工程。

<img src="https://i-blog.csdnimg.cn/blog_migrate/76de1a987a65dfd5050899ddb38849e6.png" alt="image-20210509211801243" style="zoom: 80%;" />

<img src="https://i-blog.csdnimg.cn/blog_migrate/c2a43456f87f2ded0cbac030638908d5.png" alt="image-20210509211923376" style="zoom:80%;" />

## 页面功能区介绍

打开工程后，点击左侧`.ino`文件，则会看到这样的页面：

![](https://i-blog.csdnimg.cn/blog_migrate/9b95b86034b0d4d5df0d2fc85f027020.png)

以下是各功能区之功能的介绍

### 代码编辑区

写代码的地方。

### 文件资源管理器

在此处可以对**工程目录**里的文件进行删除、打开、重命名等操作，还可以新建文件。

### 大纲

代码中定义的各种宏、函数、变量、类/结构体、模板等都会在此处显示，方便查找。

### 示例程序区

此处可以打开arduino内置的各种示例程序。

需要注意的是，打开的示例程序的工程目录里的`.vscode`文件夹不是我们自己亲手配置的文件夹，所以需要删除`.vscode`文件夹再把之前备份的`.vscode`文件夹拷一份进去。

### 标签页

顾名思义，打开的文件会在此显示标签。

### 小地图

代码的“鸟瞰图”，可当作滑动条拖动。

### 功能按钮区

如果你在此区有一个三角形的按钮，请无视它，它和arduino没有任何关系。

带有向下箭头的按钮是上传按钮，功能和arduinoIDE中的上传功能一致。

带有对勾的按钮是验证按钮，又称编译/构建按钮，功能和arduinoIDE中的验证功能一致。

形同书页的按钮是分页按钮，可以把目前的编辑界面分开成多个。

### 状态栏

这是一个很重要的功能区。

以下的按钮尤为重要：

![image-20210509214905546](https://i-blog.csdnimg.cn/blog_migrate/472d27cc74d49c34b4780deea7e7df7e.png)

请按以下顺序分别设置它们：

1. 点击最右侧的按钮，如果你开发Arduino，请选择`Arduino`，如果你开发ESP8266，请选择`ESP8266`（前提是在设置`c_cpp_properties.json`文件时将ESP8266配置方案取消了注释）
2. 点击`<Select Board Type>`，选择板型和板子的详细配置（提示，可以键入来搜索开发板）
3. 如果你开发Arduino，请点击`<Select Programmer>`，选择你使用的编程器（一般情况下使用`AVRISP MKII`）
4. 点击`<Select Serial Port>`，选择开发板位于的串口号（前提是开发板已插入电脑并正确识别）

### 问题面板

点击VSCode窗口左下角的按钮可以打开问题面板：

![image-20210509215944597](https://i-blog.csdnimg.cn/blog_migrate/3edfb1d115edfcd410462e74307b1f2e.png)

#### 问题区

此处会显示代码中存在的问题。

#### 输出区

这里

![image-20210509220127829](https://i-blog.csdnimg.cn/blog_migrate/56b66475343fccd335c2c8a54078375f.png)

选择Arduino后，当开始验证或上传后，此处会显示提示信息（等价于arduinoIDE下方的黑框）

锁头按钮可以开关自动滚动。

带有叉号的按钮可以清除输出信息。

#### 调试控制台

请无视它，arduino不需要它。

#### 终端

此处可以在工程目录下启动终端，方便某些高级操作。

## 串口监视器在哪呢？

点击状态栏中形如插头的按钮可以打开串口监视器。

再次点击可以关闭。

### 我该如何向串口发送字符串？

稍微有些遗憾的是，arduino将向串口发送字符串这一功能隐藏得特别深并且特别麻烦：

按<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>打开命令面板，输入`Arduino: Send Text to Serial Port`即可发送一个字符串。

再次发送需要再次操作。

## 其他功能

按<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>打开命令面板，输入`Arduino: Library Manager` 可以打开库管理器。

按<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>打开命令面板，输入`Arduino: Board Manager` 可以打开开发板管理器。

# 快捷键

可以通过**百度**或者**谷歌**搜索了解VSCode的快捷键。

此外，有两个快捷键是应该被知道的：

- <kbd>Ctrl+Alt+R</kbd>：**验证代码**
- <kbd>Ctrl+Alt+U</kbd>：**上传代码**

**另外，永远不要好奇地去按<kbd>Ctrl+Alt+I</kbd>！**

# 其他问题

## 如果你使用VSCode编写c/c++程序……

**如果你同时使用VSCode编写c/c++程序，请在编写c/c++的工作区禁用arduino插件，arduino插件会干扰c/c++的编写体验。**

**实在不行，就在平时全局禁用arduino插件，当你需要开发arduino时再启用它。**

## 我的Arduino插件的输出中产生了中文乱码

>  如图，如果你有这样的现象，请阅读本部分
>
> ![image-20210510185211803](https://i-blog.csdnimg.cn/blog_migrate/17bd762a2a41080345062eff1c1bac98.png)

首先查看你的Arduino插件的版本号，在这里可以查看：

![image-20210510185343276](https://i-blog.csdnimg.cn/blog_migrate/f3c7b0622e9fdd965a57bab11d29db1c.png)

然后打开文件`C:\Users\你的用户名\.vscode\extensions\vsciot-vscode.vscode-arduino-版本号\out\src\common\util.js`。

> 例如我的版本号是`0.4.2`，用户名是`Acer`，那我就应该打开`C:\Users\Acer\.vscode\extensions\vsciot-vscode.vscode-arduino-0.4.2\out\src\common\util.js`这个文件

在第`200`行左右的位置，可以看到如下的代码段：

![image-20210510185741102](https://i-blog.csdnimg.cn/blog_migrate/7443ab58c4575c47e6830d5fa92dbf40.png)

将它注释掉：

![image-20210510185822539](https://i-blog.csdnimg.cn/blog_migrate/d5dea1e39755843b8530dea9d14904ed.png)

保存，重启VSCode，打开你的工程，你会发现输出的中文不再乱码了。