import React, { useState } from 'react';
import axios from 'axios'; 
import Modal from 'react-modal';
import './GroupEditModal.css';

Modal.setAppElement('#root'); // 모달의 루트 설정

function PostEditModal({ isOpen, onRequestClose, onEdit, postId }) {
    const [postInfo, setpostInfo] = useState({
        nickname: '',
        title: '',
        content: '',
        postPassword: '',
        imageUrl: null,
        tags: [ '', '' ],
        location: '',
        moment: '',
        isPublic: true
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [imageUpload, setImageUpload] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setpostInfo({ ...postInfo, [name]: value });
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
        setpostInfo({ ...postInfo, isPublic: !postInfo.isPublic });
    };

    const resetForm = () => {
        setpostInfo({
            nickname: '',
            title: '',
            content: '',
            postPassword: '',
            imageUrl: null,
            tags: [ '', '' ],
            location: '',
            moment: '',
            isPublic: true
        });
        setImageUpload(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const imageUrl = await uploadImageAndGetURL();
        if (!imageUrl) return;

        const updatedPostinfo = { ...postInfo, imageUrl };

        try {
            const response = await axios.put(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}`, updatedPostinfo);
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
            contentLabel="Post Edit Modal"
            className="edit-modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal-content">
                <button onClick={onRequestClose} className="close-button">×</button>
                <h2>추억 수정</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">닉네임</label>
                        <input type="text" id="name" name="name" value={postInfo.nickname} placeholder="닉네임을 입력하세요" onChange={(e) => setName(e.target.value)}/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input type="text" id="title" name="title" value={postInfo.title} placeholder="제목을 입력하세요" onChange={(e) => setTitle(e.target.value)}/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="imageUpload">이미지</label>
                        <input type="file" id="imageUpload" name="imageUpload" onChange={(e) => setImageUpload(e.target.files[0])} placeholder="파일을 선택해 주세요"/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="postContent">본문</label>
                        <textarea
                            id="postContent" name="postContent" placeholder="본문 내용을 입력해 주세요" value={postInfo.content} onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="tag">태그</label>
                        <input type="text" id="tag" value={postInfo.tags} onChange={(e) => setTag(e.target.value)} placeholder="태그 입력 후 Enter"/>
                    </div>    

                    <div className="form-group">
                        <label htmlFor="location">장소</label>
                        <input type="text" id="location" name="location" value={postInfo.location} onChange={(e) => setLocation(e.target.value)} placeholder="장소를 입력해 주세요"/>
                    </div>     

                    <div className="form-group">
                        <label htmlFor="date">추억의 순간</label>
                        <input type="date" id="date" value={postInfo.moment} onChange={(e) => setDate(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="isPublic">추억 공개 선택</label>
                        <label className="switch">
                            <input type="checkbox" id="isPublic" name="isPublic"checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>
                            <span className="slider round"></span>
                        </label>
                    </div>     

                    <div className="form-group">
                        <label htmlFor="postPassword">비밀번호 생성</label>
                        <input type="password" id="postPassword" name="postPassword" placeholder="추억 비밀번호를 생성해 주세요" value={postInfo.postPassword} onChange={(e) => setPostPassword(e.target.value)} />
                    </div>

                    <button type="submit">Submit</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </Modal>
    );
}

export default PostEditModal;
