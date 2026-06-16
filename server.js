const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // ⭐️ 클라우드 DB 연결 도구 불러오기

const app = express();
const port = 3000;

app.use(express.json());

// ⭐️ [매우 중요] 아까 복사해둔 MongoDB 연결 주소를 아래에 붙여넣으세요!
// <password> 부분은 괄호 < > 를 포함해서 싹 지우고, 아까 만든 비밀번호를 적어야 합니다.
const mongoURI = 'mongodb+srv://iamseongjun:rkskekfkakqjqtk@cluster0.z1hn62j.mongodb.net/?appName=Cluster0://아이디:비밀번호@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority';

// 데이터베이스 연결!
mongoose.connect(mongoURI)
  .then(() => console.log('🟢 MongoDB 클라우드 데이터베이스 연결 성공!'))
  .catch(err => console.log('🔴 데이터베이스 연결 실패:', err));

// ⭐️ 데이터베이스에 들어갈 데이터의 모양(Schema)을 정의합니다.
const recordSchema = new mongoose.Schema({
  name: String,
  category: String, // ⭐️ [이 줄이 새롭게 추가됨!]
  date: String,
  score: Number,
  total: Number,
  wrong: Array
});

// 이 모양대로 데이터를 찍어낼 모델(Model)을 만듭니다.
const Record = mongoose.model('Record', recordSchema);

// 1. 화면 보여주기
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 학생 시험 끝! -> MongoDB에 기록 저장하기
app.post('/api/records', async (req, res) => {
  try {
    const newRecord = new Record(req.body); // 화면에서 보낸 데이터로 새 기록 생성
    await newRecord.save(); // 클라우드 DB에 영구 저장!
    console.log(`✅ 새로운 기록 저장 완료: ${req.body.name} 학생 (MongoDB에 저장됨)`);
    res.send({ message: 'DB 저장 성공!' });
  } catch (error) {
    res.status(500).send({ error: 'DB 저장 실패' });
  }
});

// 3. 관리자 접속! -> MongoDB에서 모든 기록 가져오기
app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find(); // DB에 있는 모든 기록 찾기
    res.send(records);
  } catch (error) {
    res.status(500).send({ error: '조회 실패' });
  }
});

// 4. 관리자 명령! -> MongoDB의 모든 기록 삭제하기
app.delete('/api/records', async (req, res) => {
  try {
    await Record.deleteMany({}); // DB 싹 비우기
    res.send({ message: '모든 기록이 DB에서 완전히 삭제되었습니다.' });
  } catch (error) {
    res.status(500).send({ error: '삭제 실패' });
  }
});

app.listen(port, () => {
  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});