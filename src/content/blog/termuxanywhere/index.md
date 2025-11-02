---
title: 记一次Termux上安装anywhere（一个nodejs工具）经历
description: '踩换源和KEY_TOO_SMALL两个坑'
publishDate: 2025-07-10 00:01
tags:
  - 技术
  - Termux
  - 软件
---
# anywhere介绍

> Node.js库 **anywhere** 是一个命令行工具，用于快速将当前目录转换为一个静态文件服务器的根目录。它允许用户通过简单的命令行操作，随时随地启动一个本地服务器，以便访问当前目录下的静态文件（如HTML、CSS、JavaScript等）。该工具非常适合开发和测试环境，尤其在前端开发中，可以快速搭建本地服务器，方便团队成员或设备之间共享和测试网页内容。
> 
> 安装成功后，只需在目标文件夹目录下执行 `anywhere` 命令，即可启动服务器。默认情况下，服务器会在端口 8000 上运行，并自动打开浏览器访问 `[http://localhost:8000 ](http://localhost:8000 )`。如果需要指定端口，可以使用 `-p` 参数，例如：`anywhere -p 8080`

# 安装anywhere

假设你已经装好了npm

运行`npm install anywhere -g`。

如果网络错误：换淘宝源，运行
```
npm config set registry https://registry.npmmirror.com/
```
再运行
```
npm install anywhere -g
```
然后就装好了。

# 运行anywhere
```
anywhere
```
如果提示`ERR_SSL_EE_KEY_TOO_SMALL`，原因是密钥过短（<1024位）被nodejs认为安全性不够，解决方案：

依次运行：
```
cd $PREFIX/lib/node_modules/anywhere/keys
mv cert.pem cert.pem.bak
mv key.pem key.pem.bak
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

> 注意：本文专为Termux设计，其他linux用户请把第一个命令换成`cd /usr/lib/node_modules/anywhere/keys`

然后`Country Name`填`CN`，`common name`填`localhost`，其他的条目不填直接回车

原地备份了原来的密钥并重新生成了2048位的密钥。

现在在想要的目录运行`anywhere`即可启动anywhere。

参考文献：
1. [NPM 下载更换源](https://zhuanlan.zhihu.com/p/667940152)
2. [RHEL8.9中anywhere报错error:140AB18F:SSL routines:SSL\_CTX\_use\_certificate:ee key too small的解决办法. - 人生是苦聚 - 博客园](https://www.cnblogs.com/hwajie/p/18392570)