import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './CommentRegisterModal.css';

Modal.setAppElement('#root');

function CommentRegisterModal({ isOpen, onRequestClose, postId, onCommentRegistered }) {
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

    const handleRegister = async () => {
        try {
            await registerComment(postId, nickname, content, password);
            onCommentRegistered();  
            onRequestClose();  
        } catch (error) {
            setErrorMessage('댓글 등록에 실패했습니다.');
            console.error('Error registering comment:', error);
        }
    };

    const registerComment = async (postId, nickname, content, password) => {
        try {
            await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}/comments`, {
                nickname,
                content,
                password
            });
        } catch (error) {
            throw new Error('댓글 등록에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Comment Register Modal"
            className="CRM-register-modal"
            overlayClassName="CRM-modal-overlay"
        >
            <div className="CRM-modal">
                <button onClick={onRequestClose} className="CRM-modal-close">X</button>
                <h2 className="CRM-title">댓글 등록</h2>
                <div className="CRM-register-inputs">
                    <p className="CRM-nickname-text">닉네임</p>
                    <input
                        name="crmNickname"
                        className="CRM-nickname-input"
                        placeholder="  닉네임을 입력해주세요"
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                    />
                    <p className="CRM-content-text">댓글</p>
                    <textarea
                        name="crmContent"
                        className="CRM-content-input"
                        placeholder="  댓글 내용을 입력해주세요"
                        value={content}
                        onChange={handleContentChange}
                    />
                    <p className="CRM-pw-text">비밀번호</p>
                    <input
                        name="crmPassword"
                        className="CRM-pw-input"
                        placeholder="  비밀번호를 입력해주세요"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {errorMessage && <p className="CRM-error-message">{errorMessage}</p>}
                <button className="CRM-register-btn" onClick={handleRegister}>등록하기</button>
            </div>
        </Modal>
    );
}

export default CommentRegisterModal;