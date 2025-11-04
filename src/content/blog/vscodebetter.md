---
title: 优化VSCode：让你的VSCode变得好用又美观
description: '时效性文章。'
publishDate: 2021-02-12 00:18
tags:
  - 技术
  - VSCode
  - 软件
  - 配置教程
---

万字长文！打造最顺手的vscode！

不多废话，开整！

# 提示

截止到2021/5/9下午5点10分时，最新版VSCode为1.56.0版本，本文针对该版本创作，请版本低于此版本的读者先更新一下自己的VSCode。

> [!CAUTION]
>
> 若你是来自2022、2023年甚至更以后的读者，这篇文章大概率不适用你。许多插件功能可能已经被VSCode官方收编，许多插件可能已经停止维护并有了更好的替代品，请根据自身情况选择性阅读。

# 基本设置

以下是`setting.json`的基本内容，可以优化vscode写代码体验，设置项的意义已经注释：

```json
{
    /*editor*/
    "editor.cursorBlinking": "smooth",//使编辑器光标的闪烁平滑，有呼吸感
    "editor.formatOnPaste": true,//在粘贴时格式化代码
    "editor.formatOnType": true,//敲完一行代码自动格式化
    "editor.smoothScrolling": true,//使编辑器滚动变平滑
    "editor.tabCompletion": "on",//启用Tab补全
    "editor.fontFamily": "'Jetbrains Mono', '思源黑体'",//字体设置，个人喜欢Jetbrains Mono作英文字体，思源黑体作中文字体
    "editor.fontLigatures": true,//启用字体连字
    "editor.detectIndentation": false,//不基于文件内容选择缩进用制表符还是空格
    /*
    因为有时候VSCode的判断是错误的
    */
    "editor.insertSpaces": true,//敲下Tab键时插入4个空格而不是制表符
    "editor.copyWithSyntaxHighlighting": false,//复制代码时复制纯文本而不是连语法高亮都复制了
    "editor.suggest.snippetsPreventQuickSuggestions": false,//这个开不开效果好像都一样，据说是因为一个bug，建议关掉
    "editor.stickyTabStops": true,//在缩进上移动光标时四个空格一组来移动，就仿佛它们是制表符(\t)一样
    "editor.wordBasedSuggestions": false,//关闭基于文件中单词来联想的功能（语言自带的联想就够了，开了这个会导致用vscode写MarkDown时的中文引号异常联想）
    "editor.linkedEditing": true,//html标签自动重命名（喜大普奔！终于不需要Auto Rename Tag插件了！）
    "editor.wordWrap": "on",//在文件内容溢出vscode显示区域时自动折行
    "editor.cursorSmoothCaretAnimation": true,//让光标移动、插入变得平滑
    "editor.renderControlCharacters": true,//编辑器中显示不可见的控制字符
    "editor.renderWhitespace": "boundary",//除了两个单词之间用于分隔单词的一个空格，以一个小灰点的样子使空格可见
    /*terminal*/
    "terminal.integrated.defaultProfile.windows": "Command Prompt",//将终端设为cmd，个人比较喜欢cmd作为终端
    "terminal.integrated.cursorBlinking": true,//终端光标闪烁
    "terminal.integrated.rightClickBehavior": "default",//在终端中右键时显示菜单而不是粘贴（个人喜好）
    /*files*/
    "files.autoGuessEncoding": true,//让VScode自动猜源代码文件的编码格式
    "files.autoSave": "onFocusChange",//在编辑器失去焦点时自动保存，这使自动保存近乎达到“无感知”的体验
    "files.exclude": {//隐藏一些碍眼的文件夹
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/tmp": true,
        "**/node_modules": true,
        "**/bower_components": true
    },
    "files.watcherExclude": {//不索引一些不必要索引的大文件夹以减少内存和CPU消耗
        "**/.git/objects/**": true,
        "**/.git/subtree-cache/**": true,
        "**/node_modules/**": true,
        "**/tmp/**": true,
        "**/bower_components/**": true,
        "**/dist/**": true
    },
    /*workbench*/
    "workbench.list.smoothScrolling": true,//使文件列表滚动变平滑
    "workbench.editor.enablePreview": false,//打开文件时不是“预览”模式，即在编辑一个文件时打开编辑另一个文件不会覆盖当前编辑的文件而是新建一个标签页
    "workbench.editor.wrapTabs": true,//编辑器标签页在空间不足时以多行显示
    "workbench.editor.untitled.hint": "hidden",//隐藏新建无标题文件时的“选择语言？”提示（个人喜好，可以删掉此行然后Ctrl+N打开无标题新文件看看不hidden的效果）
    /*explorer*/
    "explorer.confirmDelete": false,//删除文件时不弹出确认弹窗（因为很烦）
    "explorer.confirmDragAndDrop": false,//往左边文件资源管理器拖动东西来移动/复制时不显示确认窗口（因为很烦）
    /*search*/
    "search.followSymlinks": false,//据说可以减少vscode的CPU和内存占用
    /*window*/
    "window.menuBarVisibility": "visible",//在全屏模式下仍然显示窗口顶部菜单（没有菜单很难受）
    "window.dialogStyle": "custom",//使用更具有VSCode的UI风格的弹窗提示（更美观）
    /*debug*/
    "debug.internalConsoleOptions": "openOnSessionStart",//每次调试都打开调试控制台，方便调试
    "debug.showBreakpointsInOverviewRuler": true,//在滚动条标尺上显示断点的位置，便于查找断点的位置
    "debug.toolBarLocation": "docked",//固定调试时工具条的位置，防止遮挡代码内容（个人喜好）
    "debug.saveBeforeStart": "nonUntitledEditorsInActiveGroup",//在启动调试会话前保存除了无标题文档以外的文档（毕竟你创建了无标题文档就说明你根本没有想保存它的意思（至少我是这样的。））
    "debug.onTaskErrors": "showErrors",//预启动任务出错后显示错误，并不启动调试
    /*html*/
    "html.format.indentHandlebars": true//在写包含形如{{xxx}}的标签的html文档时，也对标签进行缩进（更美观）
}
```

# 好用的插件及其相关设置

以下列出了一些好用的插件及其相关设置，按使用情景分类。

自行选择需要的安装。

## 通用

### Chinese (Simplified) Language Pack for Visual Studio Code：必不可少的中文插件

![image-20210211192056485](https://i-blog.csdnimg.cn/blog_migrate/fddac66435b30cc118521998bf92cece.png)

汉化你的vscode！让界面、设置等都变成中文！

**配置**

无需配置，即装即用，记得装完后重启vscode。

### 驼峰翻译助手：不再让取变量名成为一件难事

![image-20210202114049249](https://i-blog.csdnimg.cn/blog_migrate/4c33a5cf151d44d65dc5cdd53d846273.png)

**英文不好 写代码起变量名时候 你是否一直这样干?**

1. 打开翻译软件
2. 输入中文
3. 复制翻译结果
4. 粘贴英文之后修改命名格式（比如小驼峰、大驼峰）

**现在你只需要按动图这样来就可以了：**

1. 选中输入按快捷键一键得到翻译结果(悄悄告诉你 直接选择英文文本还可以跳过翻译快速改变命名格式)
2. 选择你喜欢的命名格式（比如小驼峰、大驼峰）

![](https://i-blog.csdnimg.cn/blog_migrate/f9c9a7b99f85501f82865408baf1ac8e.gif)

**快捷键**

```
win: "Alt+shift+t" 
mac": "cmd+shift+t"
```

### Error Lens：在行内突出显示代码ERROR/WARNING

![image-20210509165411227](https://i-blog.csdnimg.cn/blog_migrate/dd66f4ff6d03991f00bb0712eccf293b.png)

**使用前：**

<img src="https://i-blog.csdnimg.cn/blog_migrate/55c0e8d67d92c16b35d43429c7edb5a7.png" alt="image-20210509170201568" style="zoom:80%;" />

**使用后：**

<img src="https://i-blog.csdnimg.cn/blog_migrate/8a7d953583c186859b029b3765c844ff.png" alt="image-20210509170223566" style="zoom:80%;" />

**配置**

在`settings.json`中加入如下内容作为配置，设置项的意义已经注释：

```json
"errorLens.gutterIconsEnabled": true,//在行号的左边显示小错误图标（个人喜好）
"errorLens.fontStyleItalic": true//使错误信息的字体为斜体（个人喜好）
```

### Bracket Pair Colorizer 2：美观的彩虹括号，让你不再为繁杂的括号烦恼

![image-20210211191453883](https://i-blog.csdnimg.cn/blog_migrate/e6c647891e8e5db8947eb746215e175d.png)

**使用前：**

![image-20210211191837801](https://i-blog.csdnimg.cn/blog_migrate/7779498b16172013110440d99160f225.png)

**使用后：**

![image-20210211191805784](https://i-blog.csdnimg.cn/blog_migrate/177f42e133cca2b36383c962c462b9ae.png)

**配置**

无需配置，即装即用，记得装完后重启vscode。

### Code Runner：以最简洁的方式运行任何代码

![image-20210211193113634](https://i-blog.csdnimg.cn/blog_migrate/28dda8754060a9ba002fdf144b6aa215.png)

不需要繁琐的“调试”配置，Code Runner可以快速地以最简洁的方式运行你的任何代码！

支持超过40种语言！

**一键运行**

安装好Code Runner插件之后，打开你所要运行的文件，有多种方式来快捷地运行你的代码：

- 键盘快捷键<kbd>Ctrl+Alt+N</kbd>
- 快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入 **Run Code**
- 在编辑区右键选择 **Run Code**
- 在侧边栏文件管理器中右键你要运行的文件，选择 **Run Code**
- 右上角的运行小三角按钮

这么多运行代码的方式，够便捷不？

**停止运行**

如果要停止代码运行，也有如下几种方式：

- 键盘快捷键<kbd>Ctrl+Alt+M</kbd>
- 快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入 **Stop Code Run**

**配置**

想要舒服的使用Code Runner插件，你需要进行一些配置。

> 提示：
>
> 事实上，通过**控制台**输入**命令**的方式能运行大部分代码，而Code Runner的原理就是帮你在**控制台**输入这些**命令**。
>
> 因此，Code Runner**并不能**提供运行你的代码所需的**环境或编译器**，你仍需要下载安装这些**环境或编译器**。

在`settings.json`中加入如下内容作为配置，设置项的意义已经注释：

```json
"code-runner.runInTerminal": true,//在控制台运行代码，防止乱码和不能输入
"code-runner.executorMap": {
    "javascript": " cls && cd /d $dir && node $fullFileName && pause",
    "python": " cls && cd /d $dir && \"$pythonPath\" -u $fullFileName && pause",
    "bat": " cls && cd /d $dir && $fullFileName"
    /*这是每种语言运行时所执行命令的对应表，因为笔者使用的语言有限，这里只列出了javascript、python和windows批处理的命令，其他语言的命令可自行添加*/
    /*笔者其他博客中可能会有关于对此设置项的添加或删改的内容*/
},
"code-runner.saveFileBeforeRun": true, //运行前自动保存
"code-runner.customCommand": " cls",//这使Ctrl+Alt+K这个快捷键可以快速清空控制台内容
"code-runner.respectShebang": false//我是Windows系统所以不需要按shebang来运行
"code-runner.ignoreSelection": true,//禁用“运行选中部分的代码”功能（个人喜好，感觉这个功能很鸡肋）
//需要注意的是，所有命令前都有一个空格，用来“喂给”上一次运行结尾的“请按任意键继续. . .”
```

**运行效果**

运行python：

![2](https://i-blog.csdnimg.cn/blog_migrate/2c47d1996c949bd487237765a6d5bf63.gif)

运行javascript：

![3](https://i-blog.csdnimg.cn/blog_migrate/561c1645fce7de6da5d250dcbc6c45fb.gif)

运行windows批处理：

![4](https://i-blog.csdnimg.cn/blog_migrate/fb9e266d08545f5783b4bd529966e2d7.gif)

### Polacode (fixed edition)：分享更漂亮的代码片段

![image-20210509164831759](https://i-blog.csdnimg.cn/blog_migrate/d45484799d9555f65858bbb8c20a6d03.png)

生成更好看的代码片段图片来分享给你的朋友或同事。

**用法**

快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入**Polacode**以打开Polacode面板。

打开面板后在左侧编辑器选中一段代码，右侧的Polacode面板便会呈现出好看的代码片段。

点击![](https://i-blog.csdnimg.cn/blog_migrate/a3f51039cf2260a84427ba2e189ec838.png)以保存代码片段。

**配置**

在`settings.json`中加入如下内容作为配置，设置项的意义已经注释：

```json
"polacode.target": "snippet"//去除生成的代码段图片周围的碍眼边框
```



### TODO Highlight：高亮你的TODO

![image-20210211225559473](https://i-blog.csdnimg.cn/blog_migrate/626c091b502022b7f2ee3ecf551aa53c.png)

高亮你的*TODO*注释。

**使用前**

![image-20210211225346417](https://i-blog.csdnimg.cn/blog_migrate/a818f10ba23a82d3672b622045934c63.png)

**使用后**

![image-20210211225308933](https://i-blog.csdnimg.cn/blog_migrate/3caa3f3ef3c6fcde5108897462b727fa.png)

**配置**

无需配置，即装即用，记得装完后重启vscode。

### VS Code Counter：统计代码行数

![image-20210211225622841](https://i-blog.csdnimg.cn/blog_migrate/564c666c3cc127035715d07bfe6a9ec0.png)

统计你的项目中有多少行代码！以及各语言的占比！

**用法**

快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入**Count lines in directory**以开始统计。

统计完成会生成一个`.VSCodeCounter`文件夹，并自动打开里面的报告：

例如：

![image-20210211230132635](https://i-blog.csdnimg.cn/blog_migrate/d134b1eb3009e51be6552fbf51eeaa5b.png)

## 前端开发

### CSS Navigation：快速跳转到CSS的类定义

![image-20210211200907387](https://i-blog.csdnimg.cn/blog_migrate/28994eb2167455b0b8dffb1296f2f670.png)

由于未知原因，笔者电脑上CSS Peek插件有时不起作用，遂采用更稳定的CSS Navigation作为替代品。

按住<kbd>Ctrl</kbd>键，鼠标移到html中的CSS类名上，可悬浮预览该类的CSS定义，此时按下鼠标左键，快速跳转到CSS定义处。

**效果**

![5](https://i-blog.csdnimg.cn/blog_migrate/f31c538a873f7b849bc84b3a64429079.gif)

**缺点**

不能悬浮预览和跳转到html文件内`<style>`标签内的CSS类定义，只能悬浮预览和跳转到外部.css文件的CSS类定义处。

**配置**

无需配置，即装即用，记得装完后重启vscode。

### css-auto-prefix：写CSS时不再为浏览器前缀发愁

![image-20210211202159675](https://i-blog.csdnimg.cn/blog_migrate/6b231f1acd891ba0cd1a827da68955a7.png)

自动补全不同浏览器的CSS3前缀。

**效果**

![6](https://i-blog.csdnimg.cn/blog_migrate/83d147aaef8a367d0e5732bf30dbfe73.gif)

**配置**

无需配置，即装即用，记得装完后重启vscode。

### Image Preview：快速预览HTML中的图片

![image-20210211204328501](https://i-blog.csdnimg.cn/blog_migrate/7b567a0c13251c53280b3bd7cee884eb.png)

**功能**

当鼠标移到html文档中的图片路径上时，悬浮预览图片，还可跳转到侧边栏文件管理器中或系统文件管理器中

**效果**

![7](https://i-blog.csdnimg.cn/blog_migrate/127774bd1c896f6c5278437fab792c51.gif)

**配置**

安装这个插件后默认还会在行号左边显示图片缩略图：

![image-20210211205135512](https://i-blog.csdnimg.cn/blog_migrate/6dccf18b9e14bc567d5a16b1b7b4c5e6.png)

笔者不太喜欢，所以通过在setting.json中添加如下配置关掉了这个功能：

```json
"gutterpreview.showImagePreviewOnGutter": false
```

### IntelliSense for CSS class names in HTML：自动补全CSS类名

![image-20210211205759839](https://i-blog.csdnimg.cn/blog_migrate/70a91716d25eb9b06c07a270efd0232b.png)

自动补全CSS类名。

**效果**

![8](https://i-blog.csdnimg.cn/blog_migrate/1031cc1600e48589bf639142e0a1cce0.gif)

**配置**

无需配置，即装即用，记得装完后重启vscode。

### JS-CSS-HTML Formatter：格式化js、css、html文件

![image-20210211211028432](https://i-blog.csdnimg.cn/blog_migrate/7d55cfdb53c9842b8781ac17c1dcebf6.png)

用于格式化js、css、html文件（其实主要是用来格式css文件，因为前两者vscode有内置格式化引擎）

**配置**

需要在setting.json中加入如下内容作为配置：


```json
"[html]": {
    "editor.defaultFormatter": "lonefy.vscode-JS-CSS-HTML-formatter"
},
"[javascript]": {
    "editor.defaultFormatter": "lonefy.vscode-JS-CSS-HTML-formatter"
}
"[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
},
```

*用于把 html和 js的格式化也交给这个插件负责的同时不要把json的格式化交给它负责。*

### Live Server：实时地使用浏览器预览你的前端页面

![image-20210211211836432](https://i-blog.csdnimg.cn/blog_migrate/1a4a1f680f6d98a719b0c53ffff39521.png)

还在浏览器里频繁地刷新来预览前端页面？忍受不了写一会代码就要刷新一下来预览页面？试试Live Server！

**用法**

在侧边栏文件资源管理器中右键文件选择**Open with Live Server**启动：
<img src="https://i-blog.csdnimg.cn/blog_migrate/f34e00f4359fde3c578d11589e56bc6d.png" alt="image-20210211212458192" style="zoom: 67%;" />

或打开编辑html文件时点击vscode下方状态栏右边的**Go Live**启动：
![image-20210211212812744](https://i-blog.csdnimg.cn/blog_migrate/987d2d1fc8a44e7670f2be74bce21195.png)

此时Live Server启动了一个服务器来实现实时预览前端页面。

保存文件时浏览器便会实时更新页面。

**效果**

![9](https://i-blog.csdnimg.cn/blog_migrate/eb5fc3557be4f0f19f889d73794eee0a.gif)

**停止**

快捷键<kbd>F1</kbd>或<kbd>Ctrl+Shift+P</kbd>调出 **命令面板**, 然后输入**Stop Live Server**以停止Live Server服务器。

也可以点击vscode下方状态栏右边的图标停止Live Server服务器。![image-20210211214327956](https://i-blog.csdnimg.cn/blog_migrate/ae9aff44e3d4b5501ad4cd8633236dd1.png)

> 注意：关闭浏览器并不会停止Live Server服务器，但关闭vscode可以停止Live Server服务器。

**配置**

默认使用系统默认浏览器访问服务器，通过在setting.json中添加如下配置可以改变访问服务器所用的浏览器：

```json
"liveServer.settings.CustomBrowser": 浏览器名
```

***浏览器名*** 的取值如下（默认为null）：

![image-20210211222847920](https://i-blog.csdnimg.cn/blog_migrate/c6e4c91d553fe181b37f45e30e63ab08.png)

### open in browser：从vscode打开浏览器以预览前端页面

![image-20210211221440912](https://i-blog.csdnimg.cn/blog_migrate/3d9cbc9379df366a4d133ef62a93a48d.png)

在vscode中打开浏览器以预览前端页面

**用法**

在侧边栏文件资源管理器中右键html文件选择**Open In Default Browser**从浏览器打开以预览页面：

![image-20210211222253331](https://i-blog.csdnimg.cn/blog_migrate/0b1925ef0a51c2e5d52983a23d71806a.png)

如果要在其他浏览器打开可以选择**Open In Other Browsers**。

**配置**

无需配置，即装即用，记得装完后重启vscode。

### Path Intellisense：智能补全路径

![image-20210211223241272](https://i-blog.csdnimg.cn/blog_migrate/108db6f7eae9966255e6faf188af213c.png)

智能补全html文件中的文件路径。

**效果**

![11](https://i-blog.csdnimg.cn/blog_migrate/09f368e1a199640385b9eefbedc28823.gif)

**配置**

无需配置，即装即用，记得装完后重启vscode。

## 摸鱼

### epub reader：摸鱼必备！vscode看小说！支持epub！

![image-20210211203047646](https://i-blog.csdnimg.cn/blog_migrate/b93bef65b5ea14ce3f41bc1c6597da75.png)

**功能**

- 支持字体大小，字体颜色自定义
- 阅读进度显示以及自动记录
- 支持目录跳转
- 书架编辑

**添加书本**

在`C:\Users\你的用户名\.vscode\extensions\renkun.reader-1.1.6\book`路径下增删书本文件（须为`.epub`文件类型）

**用法**

按<kbd>Ctrl+3</kbd>进入小说阅读界面，鼠标移到书本目录下方可自定义字体大小颜色（记得点`save`哦）。

点击要阅读的书本，进入后左右有按钮可翻页，鼠标移到小说阅读界面上方可返回或进行章节跳转。
## 写作
### 中文引号修正：解决写作时的小毛病

![image-20210211185956749](https://i-blog.csdnimg.cn/blog_migrate/24f919f199f115d514e16980fc4d21ed.png)

用于自动修正中文文档里的双引号。在用vscode写作时格外有用。

它假设 `“` 和 `”` 应当依次轮流出现。比如如下这段

> ”你听说过Lisa吗？”
>
> “没有欸“我说道，”她是不是那个勇者的母亲？“

会被修正为

> “你听说过Lisa吗？”
>
> “没有欸”我说道，“她是不是那个勇者的母亲？”

**用法**

有两种用法：

1. 选中一部分文档内容 -> <kbd>Ctrl+Shift+P</kbd>调出**命令面板** -> 输入`Smart Quote`， 然后回车。这个是只修正选中部分。
2. 什么都不选，直接<kbd>Ctrl+Shift+P</kbd>调出**命令面板** -> 输入 `Smart Quote`， 然后回车。这个是全部修正。

**已知问题**

目前无法处理多个不连续选择的情况。

目前无法修正单引号。

### Markdown All in One：书写Markdown利器

![image-20210211214635448](https://i-blog.csdnimg.cn/blog_migrate/d7f249fb7207baf34b5f1796d5f80538.png)

从”All in One“的名字可以看出该插件含有很多功能，可以增强Markdown写作体验。

具体有哪些功能，大家可以自己探索，笔者不多介绍了。

**配置**

无需配置，即装即用，记得装完后重启vscode。

### Word Count CJK：写作必备的字数统计插件

![image-20210211215030345](https://i-blog.csdnimg.cn/blog_migrate/0d5018761ca0898060316928d5bfc106.png)

大部分字数统计插件都不能统计中文的字数，而这个插件可以。

在编辑Markdown或纯文本（txt）时，在vscode下方状态栏左边可以显示实时字数统计。

**效果**

![10](https://i-blog.csdnimg.cn/blog_migrate/715a96fc12b6741e425de69225c43f29.gif)

**配置**

在`settings.json`中加入如下内容作为配置：

```json
"wordcount_cjk.statusBarTextTemplate": "中文字数：${cjk} ,英文单词数：${en_words} ,非空白字符数：${total - whitespace} ,总字符数：${total}",
"wordcount_cjk.activateLanguages": [
    "markdown",
    "plaintext"
]
```

# 主题

笔者所用的主题叫做**Gruvbox Material Dark**。

由该插件提供：

![image-20210211235331645](https://i-blog.csdnimg.cn/blog_migrate/77a39bd7c04b2f31fcff73b3f5f91e87.png)

看起来像这样：

![image-20210212000344269](https://i-blog.csdnimg.cn/blog_migrate/a4e6421078e0d11925776c48d4ffddf9.png)

**配置**

下载安装该插件后须在setting.json中加入如下内容作为配置，设置项的意义已经注释：

```json
"gruvboxMaterial.italicKeywords": true,//关键字为斜体
"gruvboxMaterial.darkContrast": "hard"//加深对比度（默认的太浅了）
```