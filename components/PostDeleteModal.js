import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; 
import './PostDeleteModal.css';

const PostDeleteModal = ({ isOpen, onRequestClose, onDelete, postId }) => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDelete = async () => {
        try {
            await deletePost(postId, password);
            onDelete(); 
            onRequestClose(); 
        } catch (error) {
            setErrorMessage('추억 삭제에 실패했습니다.'); 
            console.error('Error deleting post:', error); 
        }
    };


    const deletePost = async (postId, password) => {
        try {
            await axios.delete(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}`, {
                data: { postPassword: password } 
            });
        } catch (error) {
            throw new Error('추억 삭제에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Post Delete Modal"
            className="PDM-delete-modal"
            overlayClassName="PDM-modal-overlay"
        >
            <div className="PDM-modal">
                <button onClick={onRequestClose} className="PDM-modal-close">X</button>
                <h2 className="PDM-title">추억 삭제</h2>
                <div className="PDM-delete-check">
                    <p classNAme="PDM-text">삭제 권한 인증</p>
                    <input
                        name="pdmpw"
                        className="PDM-pw-input"
                        placeholder="비밀번호를 입력해주세요"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {errorMessage && <p className="PDM-error-message">{errorMessage}</p>} 
                <button className="PDM-delete-btn" onClick={handleDelete}>삭제하기</button>
            </div>
        </Modal>
    );
};

export default PostDeleteModal;
