npm start

> ws@1.0.0 start
> node dist/index.js

/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:13639
const moveX = parsedData.payload.x;
^

TypeError: Cannot read properties of undefined (reading 'x')
at \_WebSocket.<anonymous> (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:13639:44)
at \_WebSocket.emit (node:events:520:28)
at Receiver2.receiverOnMessage (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:3122:24)
at Receiver2.emit (node:events:520:28)
at Receiver2.dataMessage (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:1343:18)
at Receiver2.getData (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:1258:14)
at Receiver2.startLoop (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:990:20)
at Receiver2.\_write (/home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws/dist/index.js:928:14)
at writeOrBuffer (node:internal/streams/writable:564:12)
at \_write (node:internal/streams/writable:493:10)

Node.js v22.3.0
npm ERR! Lifecycle script `start` failed with error:
npm ERR! Error: command failed
npm ERR! in workspace: ws@1.0.0
npm ERR! at location: /home/gabriel_1/ZXC/code/Projects/meta/mayaverse/apps/ws
