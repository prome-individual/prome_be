const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const diagRoutes = require('./src/routes/diagRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors()); // use : 모든 요청이 들어올 때 이걸 먼저 실행해줘 (모든 요청에 대해 cors 허용)
app.use(bodyParser.json()); 

// app.use('/auth, authRoutes) // 사용자가 /api/users로 요청하면 useRoutes 파일에서 처리
// app.use('/diagnose', diagRoutes)
// app.use('/chat', chatRoutes)
// app.use('/hospital', hospitalRoutes)

app.get("/", (req, res) => {
    res.json({message: "서버 작동 중"});
})

app.use(errorHandler); // 에러나면 errorHandler로 보내줘

module.exports = app;