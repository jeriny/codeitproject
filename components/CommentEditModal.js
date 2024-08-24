import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './CommentEditModal.css';

Modal.setAppElement('#root');

const CommentEditModal = ({ isOpen, onRequestClose, commentId, onCommentUpdated }) => {
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEdit = async () => {
        try {
            await EditComment(commentId, nickname, content, password);
            onCommentUpdated();  // 댓글 업데이트 후 호출
            onRequestClose();  // 모달 닫기
        } catch (error) {
            setErrorMessage('댓글 수정에 실패했습니다.');
            console.error('Error editing comment:', error.response || error.message);
        }
    };

    const EditComment = async (commentId, nickname, content, password) => {
        try {
            const response = await axios.put(`https://zogakzip-api-gr4l.onrender.com/api/comments/${commentId}`, {
                nickname,
                content,
                password
            });

            // 서버 응답 확인
            if (response.status !== 200) {
                throw new Error(`댓글 수정에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error('Error editing comment:', error.response || error.message);
            throw new Error('댓글 수정에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Comment Edit Modal"
            className="CEM-edit-modal"
            overlayClassName="CEM-modal-overlay"
        >
            <div className="CEM-modal">
                <button onClick={onRequestClose} className="CEM-modal-close">X</button>
                <h2 className="CEM-title">댓글 수정</h2>
                <p className="CEM-nickname-text">닉네임</p>
                <input
                    className="CEM-nickname-input"
                    placeholder="  닉네임을 입력해주세요"
                    value={nickname}
                    onChange={handleNicknameChange}
                />
                <p className="CEM-content-text">댓글</p>
                <textarea
                    className="CEM-content-input"
                    placeholder="  댓글을 입력해주세요"
                    value={content}
                    onChange={handleContentChange}
                />
                <p className="CEM-pw-text">비밀번호</p>
                <input
                    className="CEM-pw-input"
                    placeholder="  비밀번호를 입력해주세요"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                {errorMessage && <p className="CEM-error-message">{errorMessage}</p>}
                <button className="CEM-edit-btn" onClick={handleEdit}>수정하기</button>
            </div>
        </Modal>
    );
};

export default CommentEditModal;