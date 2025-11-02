---
title: thedamn：在CMD上使用thefuck
description: '时效性文章'
publishDate: 2021-05-05 12
tags:
  - 技术
  - 软件
  - Windows
  - 配置教程
---

# 前言

众所周知，有一个Python编写的小工具[*thefuck*](https://github.com/nvbn/thefuck)可以帮助我们自动修正键入命令中的错误，但可惜的是它并不能在cmd里使用。为了照顾到那些习惯于使用cmd的程序员（比如我），github上的[zyf722](https://github.com/zyf722)大佬用python编写了在cmd下的thefuck的替代品[*thedamn*](https://github.com/zyf722/thedamn)以实现在cmd中使用*thefuck*的效果。

# 安装thedamn

首先确保你拥有python3.x的环境，没有的自行百度python安装教程

之后，在**有管理员权限的**cmd中使用以下命令：

```
git clone https://github.com/zyf722/thedamn.git
```

> 若网络不好无法使用`git clone`，可以在github的项目页面下载项目的ZIP包然后解压。

> `git clone`命令所创建的项目目录或ZIP包解压后的目录，其实就是*thedamn*的安装目录。

再使用cd命令进入项目目录，输入`install.py`并回车以安装*thedamn*。

> 确保你在运行`install.py`的时候是处在管理员权限下

当控制台显示`[!] Done.`字样，表示安装成功。

> 安装成功后不要删除这个项目目录，因为*thedamn*的本体是在这个目录里的。

# 使用thedamn

> 稍微有点遗憾的是，*thedamn*只支持对`XXX 不是内部或外部命令，也不是可运行的程序
> 或批处理文件。`这样的“未知命令错误”或`git`、`pip`等工具的“未知子命令错误”进行修正，功能上稍逊于真正的*thefuck*。

当你输入一个错误的命令并想修复它时，只需输入如下命令：

![example_default](https://i-blog.csdnimg.cn/blog_migrate/24841e811c7dc7e2db3c3176ebef6ef7.gif)

此外，如果*thedamn*命令给出的命令不是你想要的，可以输入`c`来在*thedamn*给出的其他命令中选择：

![example_candicates](https://i-blog.csdnimg.cn/blog_migrate/266c769f34626c630469570cd81e7567.gif)

*thedamn*还支持对`git`、`pip`等工具的“未知子命令错误”进行修正：

![example_second_command](https://i-blog.csdnimg.cn/blog_migrate/8a091ae08b858b004755f4669b2ec72a.gif)

如果你认为“damn”这个单词表达的情感不如“fuck”强烈，或是想让*thedamn*用起来和*thefuck*一样，请把*thedamn*安装目录下的`damn.bat`文件的名字修改为`fuck.bat`，这样在使用*thedamn*时，敲的就不是`damn`而是`fuck`了。

![1r](https://i-blog.csdnimg.cn/blog_migrate/302f531fd9aec0b293f14d5eb4c59527.gif)

# 自定义命令

*thedamn*支持自定义的可以修正的命令或子命令，详细请见*thedamn*原github项目的README文件

# 其他

本博客文章的部分图片来源于[*thedamn*原github项目的README文件](https://github.com/zyf722/thedamn)，如有侵权，联系删除。