import React, { useState } from 'react';
import axios from 'axios';
import './PostAccess.css';
import Modal from './Modal'; 
import { useParams, useNavigate } from 'react-router-dom';

function PostAccess() {
    const [postPassword, setPostPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { groupId } = useParams();
    const navigate = useNavigate(); 
 
    const handleSubmit = async (e) => {
        e.preventDefault();  
        try { 
            const response = await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}/verify-password`, { 
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setMessage("비밀번호가 일치합니다");
                navigate(`/group/${groupId}`); //경로 수정해야함. 
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("비밀번호가 일치하지 않습니다");
            } else {
                setMessage("에러가 발생했습니다.");
            }
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/');
    };

    return (
        <div>
            <main className="description">
                <div>
                    <h2>비공개 추억</h2>
                    <p>비공개 추억에 접근하기 위해 권한 확인이 필요합니다.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="postPassword">비밀번호 입력</label>
                        <input
                            type="password"
                            id="postPassword"
                            name="postPassword"
                            placeholder="추억 비밀번호를 입력해 주세요"
                            value={postPassword}
                            onChange={e => setPostPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">제출하기</button>
                </form>
                {showModal && <Modal message={message} onClose={handleCloseModal} />}
            </main>
        </div>
    );
}

export default PostAccess;