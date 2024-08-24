import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './CommentDeleteModal.css';

Modal.setAppElement('#root');

function CommentDeleteModal({ isOpen, onRequestClose, commentId, onCommentDeleted }) {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDelete = async () => {
        try {
            await deleteComment(commentId, password);
            onCommentDeleted();  // 댓글 삭제 후 호출
            onRequestClose();  // 모달 닫기
        } catch (error) {
            setErrorMessage('댓글 삭제에 실패했습니다.'); 
            console.error('Error deleting comment:', error); 
        }
    };

    const deleteComment = async (commentId, password) => {
        try {
            await axios.delete(`https://zogakzip-api-gr4l.onrender.com/api/comments/${commentId}`, {
                data: { password } 
            });
        } catch (error) {
            throw new Error('댓글 삭제에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Comment Delete Modal"
            className="CDM-delete-modal"
            overlayClassName="CDM-modal-overlay"
        >
            <div className="CDM-modal">
                <button onClick={onRequestClose} className="CDM-modal-close">X</button>
                <h2 className="CDM-title">댓글 삭제</h2>
                <div className="CDM-delete-check">
                    <p className="CDM-text">삭제 권한 인증</p>
                    <input
                        name="cdmpw"
                        className="CDM-pw-input"
                        placeholder="비밀번호를 입력해주세요"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {errorMessage && <p className="CDM-error-message">{errorMessage}</p>}
                <button className="CDM-delete-btn" onClick={handleDelete}>삭제하기</button>
            </div>
        </Modal>  
    );
}

export default CommentDeleteModal;