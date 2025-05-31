const prisma = require('../models/prisma');
const createError = require('../utils/createError');

module.exports.ask = async (req, res, next) => {
    // TODO : 질문하기
    // AI -> 답변 만들어서 보여줌
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

