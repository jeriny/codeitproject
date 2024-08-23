import React, { useState } from 'react';
import axios from 'axios';
import './GroupAccess.css';
import Modal from './Modal'; 
import { useNavigate } from 'react-router-dom';

function GroupAccess({ groupId }) {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate(); // 네비게이션 기능 사용
 
    const handleSubmit = async (event) => {
        event.preventDefault();  
        try { 
            const response = await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/verify-password`, { 
                
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setMessage(response.data.message);
                navigate('/group/${response.data.id}'); 
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
                    <h2>비공개 그룹</h2>
                    <p>비공개 그룹에 접근하기 위해 권한 확인이 필요합니다.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호를 입력해주세요</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="비밀번호를 입력해 주세요"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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

export default GroupAccess;