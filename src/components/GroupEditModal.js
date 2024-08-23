import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './GroupEditModal.css';

Modal.setAppElement('#root'); // 모달의 루트 설정

function GroupEditModal({ isOpen, onRequestClose, onEdit, groupId }) {
    const [groupInfo, setGroupInfo] = useState({
        name: '',
        password: '',
        imageUrl: null,
        isPublic: true,
        introduction: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [imageUpload, setImageUpload] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupInfo({ ...groupInfo, [name]: value });
    };

    const uploadImageAndGetURL = async () => {
        if (!imageUpload) {
            setErrorMessage('이미지 파일을 선택해주세요.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', imageUpload);

        try {
            const response = await axios({
                method: 'post',
                url: 'https://zogakzip-api-gr4l.onrender.com/api/image',
                data: formData
            });
            return response.data.imageUrl;
        } catch (error) {
            setErrorMessage('이미지 업로드 실패');
            return null;
        }
    };

    const toggleIsPublic = () => {
        setGroupInfo({ ...groupInfo, isPublic: !groupInfo.isPublic });
    };

    const resetForm = () => {
        setGroupInfo({
            name: '',
            password: '',
            imageUrl: null,
            isPublic: true,
            introduction: ''
        });
        setImageUpload(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const imageUrl = await uploadImageAndGetURL();
        if (!imageUrl) return;

        const updatedGroupInfo = { ...groupInfo, imageUrl };

        try {
            const response = await axios.put(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}`, updatedGroupInfo);
            if (response.status === 200) {
                resetForm();
                onRequestClose(); 
                onEdit();
            } else {
                setErrorMessage(response.data.message || '업데이트 실패');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || '서버 오류 발생');
            } else {
                setErrorMessage('네트워크 오류 발생');
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Group Edit Modal"
            className="edit-modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-content">
                <button onClick={onRequestClose} className="close-button">×</button>
                <h2>그룹 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={groupInfo.name} onChange={handleInputChange} placeholder="그룹명" />
                    <input type="file" name="imageUpload" onChange={(e) => setImageUpload(e.target.files[0])} />
                    <textarea name="introduction" value={groupInfo.introduction} onChange={handleInputChange} placeholder="그룹 소개" />
                    <label>
                        그룹 공개 선택:
                        <input type="checkbox" checked={groupInfo.isPublic} onChange={toggleIsPublic} />
                    </label>
                    <input type="password" name="password" value={groupInfo.password} onChange={handleInputChange} placeholder="비밀번호를 입력하세요" />
                    <button type="submit" className="edit-btn">수정하기</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </Modal>
    );
}

export default GroupEditModal;
