const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const createError = require('../utils/createError');

module.exports.diagnose = async (req, res, next) => {
    // TODO : AI 서버에 데이터 보냄
    // AI -> 검사 실행
    // TODO : 결과를 DB에 추가
};

module.exports.diagResult = async (req, res, next) => {
    // TODO : 특정 diag_id 의 DB 정보 GET
};