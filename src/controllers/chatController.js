const prisma = require('../models/prisma');
const createError = require('../utils/createError');
const aiService = require('../services/aiService');
import { generateAnswer } from '../services/aiService';

module.exports.ask = async (req, res, next) => {
    // TODO : 질문하기
    // AI -> 답변 만들어서 보여줌
    try {
        // [1] 요청 본문에서 chat_id, content 추출 및 유효성 검사
        const { chat_id, content } = req.body;

        // 사용자 인증 미들웨어를 통해 이 채팅방의 소유주가 맞는지 확인하는 로직이 추가될 수 있습니다.
        // const userId = req.user.id; 
        // const roomOwner = await prisma.chatRoom.findFirst({ where: { chat_id: chat_id, user_id: userId } });
        // if (!roomOwner) { return next(createError(403, '권한이 없습니다.', 'FORBIDDEN')); }

        if (!chat_id || !content || typeof content !== 'string' || content.trim() === '') {
            return next(createError(400, '질문을 입력해주세요', 'INVALID_INPUT'));
        }

        let aiContent;
        let responseMessage = "질문하기 성공";

        try {
            // [3] FastAPI AI 서버에 질문 전송
            const aiResponse = await aiService.generateAnswer({ question: content });
            
            // [4] AI 응답 성공 여부 확인
            if (aiResponse && aiResponse.answer) {
                aiContent = aiResponse.answer;
            } else {
                throw new Error('Invalid AI response format');
            }
        } catch (error) {
            // [4-실패] AI 응답 실패 시
            console.error("AI 응답 생성 실패:", error.message);
            aiContent = "죄송합니다. 답변을 생성하지 못했습니다.";
            responseMessage = "AI 응답 실패, 기본 메시지로 대체됨";
        }

        // [2, 5] 질문과 답변을 트랜잭션으로 동시에 저장
        // 하나라도 실패하면 모두 롤백되어 데이터 정합성을 보장합니다.
        const [questionRecord, answerRecord] = await prisma.$transaction([
            // 질문 저장 (Model: ChatComment)
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id,       // 스키마에 정의된 외래 키 필드
                    content: content,
                    is_question: true
                    // ChatComment 모델에는 user_id가 없으므로 제거
                }
            }),
            // 답변 저장 (Model: ChatComment)
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id,       // 스키마에 정의된 외래 키 필드
                    content: aiContent,
                    is_question: false
                }
            })
        ]);

        // [6] 최종 응답 반환 (HTTP 201)
        return res.status(201).json({
            message: responseMessage,
            success: true,
            chat: {
                chat_id: chat_id,
                question: {
                    content_id: questionRecord.content_id,
                    content: questionRecord.content,
                    is_question: questionRecord.is_question,
                    created_at: questionRecord.created_at
                },
                answer: {
                    content_id: answerRecord.content_id,
                    content: answerRecord.content,
                    is_question: answerRecord.is_question,
                    created_at: answerRecord.created_at
                }
            }
        });

    } catch (err) {
        // [ERROR 경로] DB 오류(트랜잭션 실패 포함) 등 예측하지 못한 모든 에러 처리
        next(err);
    }

    
};

module.exports.getChat = async (req, res, next) => {
    // TODO : 해당 user의 특정 chat_id 채팅들 GET
    try {
        const { chat_id } = req.params;

        // chat_id는 보통 숫자니까 숫자 체크
        if (isNaN(chat_id)) {
            return next(createError(400, 'chat_id가 잘못되었습니다.', 'INVALID_CHAT_ID'));
        }

        // ChatRoom 조회 (댓글 포함)
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { chat_id: Number(chat_id) },
            include: {
                comments: {
                    orderBy: { created_at: 'asc' } // 시간순 정렬
                }
            }
        });

        if (!chatRoom) {
            return next(createError(404, '채팅방을 찾을 수 없습니다.', 'CHATROOM_NOT_FOUND'));
        }

        // 응답 포맷 맞추기
        const responseData = {
            chat_id: chatRoom.chat_id,
            title: chatRoom.title || "채팅방", // title이 없으면 "자동 생성" 기본값
            history: chatRoom.comments.map(comment => ({
                content_id: comment.content_id,
                is_question: comment.is_question,
                content: comment.content,
                created_at: comment.created_at
            }))
        };

        return res.status(200).json({
            data: responseData,
            message: '채팅 보기 성공',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getChatPeriod = async (req, res, next) => {
    // TODO : 해당 user의 특정 period chat GET
    // 이 때, period는 created_at으로 여기서 만들어서 GET
};

