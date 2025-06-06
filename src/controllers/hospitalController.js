const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const createError = require('../utils/createError');
const aiService = require('../services/aiService');

module.exports.findHospital = async(req, res, next) => {
    // AI -> hospital list 뽑는 함수 실행
    // TODO : DB에 추가
};

module.exports.getHospital = async (req, res, next) => {
    // TODO : 현재 user의 hospital list 내용 GET
};

module.exports.getHospitalDetail = async (req, res, next) => {
    // TODO : hospital_id에 맞는 hospital 정보 GET
};

module.exports.reserveHospital = async (req, res, next) => {
    // AI -> 통화, 일정 추출
    // TODO : 얻은 Response ???
};

module.exports.scheduleHospital = async (req, res, next) => {
    // TOOO : 위에서 추출된 정보를 calendar table에 추가
};

module.exports.getCalendar = async (req, res, next) => {
 // TODO : 현재 user의 캘린더 예약 내용 다 GET
};

module.exports.getCalendarDetail = async (req, res, next) => {
    // TODO : 상세 calendar 내용 GET
};