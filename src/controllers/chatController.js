const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const createError = require('../utils/createError');

module.exports.ask = async (req, res, next) => {
    // TODO : 질문하기
    // AI -> 답변 만들어서 보여줌
};

module.exports.getChat = async (req, res, next) => {
    // TODO : 해당 user의 특정 chat_id 채팅들 GET
};

module.exports.getChatPeriod = async (req, res, next) => {
    // TODO : 해당 user의 특정 period chat GET
    // 이 때, period는 created_at으로 여기서 만들어서 GET
};