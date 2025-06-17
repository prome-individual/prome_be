
import prisma from '../models/prisma.js';
import createError from '../utils/createError.js';
import * as ai from '../services/aiService.js';

export const ask = async (req, res, next) => {
    try {
        // [1] 요청 본문에서 데이터 추출 (chat_id는 없을 수도 있으므로 let으로 선언)
        let { chat_id, content } = req.body;

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return next(createError(400, '질문을 입력해주세요', 'INVALID_INPUT'));
        }

        // 💡 --- 새로운 채팅방 생성 로직 (핵심) ---
        if (!chat_id) {
            // 사용자 인증 미들웨어를 통해 req.user.id가 설정되었다고 가정합니다.
            // 이 부분이 없다면, user_id를 다른 방법으로 가져와야 합니다.
            const userId = req.user.userId;
            if (!userId) {
                return next(createError(401, '로그인이 필요합니다.', 'UNAUTHORIZED'));
            }

            const newChatRoom = await prisma.chatRoom.create({
                data: {
                    user_id: userId,
                    title: content.substring(0, 30) // 첫 질문의 앞 30자를 제목으로 자동 생성
                }
            });
            chat_id = newChatRoom.chat_id; // 새로 생성된 chat_id를 변수에 할당
        }
        // 💡 --- 로직 종료 ---

        let aiContent;
        let responseMessage = "질문하기 성공";

        try {
            const aiResponse = await ai.generateAnswer({ question: content });
            
            if (aiResponse && aiResponse.answer) {
                aiContent = aiResponse.answer;
            } else {
                throw new Error('Invalid AI response format');
            }
        } catch (error) {
            console.error("AI 응답 생성 실패:", error.message);
            aiContent = "죄송합니다. 답변을 생성하지 못했습니다.";
            responseMessage = "AI 응답 실패, 기본 메시지로 대체됨";
        }

        const [questionRecord, answerRecord] = await prisma.$transaction([
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id, // 이제 chat_id는 항상 유효한 값입니다.
                    content: content,
                    is_question: true
                }
            }),
            prisma.chatComment.create({
                data: {
                    chat_id: chat_id, // 이제 chat_id는 항상 유효한 값입니다.
                    content: aiContent,
                    is_question: false
                }
            })
        ]);

        return res.status(201).json({
            message: responseMessage,
            success: true,
            chat: {
                chat_id: chat_id, // 새로 생성되었을 수 있는 chat_id를 응답에 포함
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
        next(err);
    }
};

export const getChat = async (req, res, next) => {
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

export const getChatPeriod = async (req, res, next) => {
    // TODO : 해당 user의 특정 period chat GET
    // 이 때, period는 created_at으로 여기서 만들어서 GET
};

