const express = require('express')
const app = express()
app.listen(7777)

// 이 밑에 두 파일을 심으면 된다.

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')

app.use("/", userRouter)
app.use("/channels", channelRouter)