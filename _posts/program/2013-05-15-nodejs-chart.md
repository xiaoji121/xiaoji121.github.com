---
layout: post
title: "用Node.js实现群聊"
category: program
tags: [javascript,node.js]
comments: true
keywords: Node.js,群聊,聊天功能
description: |
    在这篇文章里，我展示一下怎么用Node.js实现一个简单的群聊聊天功能，代码只有短短30行，却能实现这样一个功能，不得不赞叹Node.js的强大。
---
## 一段视频

<embed width="600" height="400" src="http://player.youku.com/player.php/sid/XNTU3MjM1OTU2/v.swf" play="false" loop="false" quality="high"> </embed>

这段视频展示了Node.js实现的群聊效果。我首先打开了一个终端窗口，执行了服务器端程序。

    node test.js

随后，打开3个终端窗口，作为客户端，在每个客户端中请求连接群聊服务。

    nc localhost 4001

这时，服务端接收到连接请求，连接成功。随后，客户端发起聊天，如上视频所示。

## 源代码(test.js)

<pre class="prettyprint">
    var net = require('net');

    var server = net.createServer();

    var sockets = [];

    server.on('connection', function(socket) {
        console.log('got a new connection');
        socket.write('System say: Welcome!\n');

        // 存储已建立的连接
        sockets.push(socket);

        socket.on('data', function(data) {
            sockets.forEach(function(otherSocket) {
                if( otherSocket !== socket ) {
                    // 向其他人发送消息
                    var prefix = 'User ' + sockets.indexOf(socket) + ' say: ';
                    otherSocket.write(prefix + data);
                }
            });
        });

        socket.on('close', function() {
            console.log('connection closed');

            var index = sockets.indexOf(socket);
            // 删除已经断开的连接
            sockets.splice(index, 1);
        });
    });

    server.on('error', function(err) {
        console.log('Server error: ', err.message);
    });

    server.on('close', function() {
        console.log('Server closed');
    });

    server.listen(4001);
</pre>

## 总结

这段短短30行的代码很好地演示了怎样用Node.js建一个TCP服务器，如果你觉得有意思，那就从此开始你的Node.js之旅吧！

