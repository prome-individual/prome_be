import jwt from 'jsonwebtoken';
import prisma from '../models/prisma.js';
import createError from '../utils/createError.js';
import * as ai from '../services/aiService.js';

export const findHospital = async(req, res, next) => {
    // AI -> hospital list 뽑는 함수 실행
    // TODO : DB에 추가
};

export const getHospital = async (req, res, next) => {
    // TODO : 현재 user의 hospital list 내용 GET
};

export const getHospitalDetail = async (req, res, next) => {
    // TODO : hospital_id에 맞는 hospital 정보 GET
};

export const reserveHospital = async (req, res, next) => {
    // AI -> 통화, 일정 추출
    // TODO : 얻은 Response ???
};

export const scheduleHospital = async (req, res, next) => {
    // TOOO : 위에서 추출된 정보를 calendar table에 추가
};

export const getCalendar = async (req, res, next) => {
 // TODO : 현재 user의 캘린더 예약 내용 다 GET
};

export const getCalendarDetail = async (req, res, next) => {
    // TODO : 상세 calendar 내용 GET
};