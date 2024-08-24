import React, { useState } from 'react';
import axios from 'axios';
import './MakePost.css';
import Modal from './Modal'; 
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function MakePost() {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [postContent, setPostContent] = useState('');
    const [tag, setTag] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [postPassword, setPostPassword] = useState('');
    const [groupPassword, setGroupPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const { groupId } = useParams();
    const navigate = useNavigate(); 

    const uploadImageAndGetURL = async () => {
        if (!imageUpload) {
            setMessage('이미지 파일을 선택해주세요.');
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
            setMessage('이미지 업로드 실패');
            return null;
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();  
        console.log(`Tag: ${tag}, Date: ${date}`);  

        const imageUrl = await uploadImageAndGetURL();
        if (!imageUrl) {
            setMessage('이미지 업로드에 실패했습니다.');
            return; 
        }
        console.log(imageUrl); // 이미지 URL 확인

        const PostData = {
            nickname: name,          
            title: title,  
            content: postContent,  
            postPassword: postPassword,  
            groupPassword: groupPassword, 
            imageUrl: imageUrl,  
            tags: tag,  
            location: location,
            moment: date,  
            isPublic: isPublic 
        }

        try { 
            const response = await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/verify-password`, { 
                password: groupPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setMessage("그룹 비밀번호가 일치합니다");
                console.log("그룹 비밀번호가 일치합니다");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("그룹 비밀번호가 일치하지 않습니다");
                console.log("그룹 비밀번호가 일치하지 않습니다");
            } else {
                setMessage("에러가 발생했습니다.");
                console.log("에러가 발생했습니다.");
            }
            setShowModal(true);
        }

        try {
            const response = await axios({
                method: 'post',
                url: `https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/posts`,
                headers: {
                    'Content-Type': 'application/json' 
                },
                data: JSON.stringify(PostData)
            });
            const result = response.data;
            console.log(result.message); 
            setMessage('추억 만들기 성공');
            setShowModal(true);
        } catch (error) {
            setMessage('추억 만들기 실패');
            setShowModal(true);
            
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(`/group/:groupId/:postId`); 
    };

    return (
        <div>
            <main>
                <h2>추억 올리기</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">닉네임</label>
                        <input type="text" id="name" name="name" value={name} placeholder="닉네임을 입력하세요" onChange={(e) => setName(e.target.value)}/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input type="text" id="title" name="title" value={title} placeholder="제목을 입력하세요" onChange={(e) => setTitle(e.target.value)}/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="imageUpload">이미지</label>
                        <input type="file" id="imageUpload" name="imageUpload" onChange={(e) => setImageUpload(e.target.files[0])} placeholder="파일을 선택해 주세요"/>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="postContent">본문</label>
                        <textarea
                            id="postContent" name="postContent" placeholder="본문 내용을 입력해 주세요" value={postContent} onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                    </div>      

                    <div className="form-group">
                        <label htmlFor="tag">태그</label>
                        <input type="text" id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="태그 입력 후 Enter"/>
                    </div>    

                    <div className="form-group">
                        <label htmlFor="location">장소</label>
                        <input type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="장소를 입력해 주세요"/>
                    </div>     

                    <div className="form-group">
                        <label htmlFor="date">추억의 순간</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="isPublic">추억 공개 선택</label>
                        <label className="switch">
                            <input type="checkbox" id="isPublic" name="isPublic"checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>
                            <span className="slider round"></span>
                        </label>
                    </div>     

                    <div className="form-group">
                        <label htmlFor="postPassword">게시글 비밀번호 설정하기</label>
                        <input type="password" id="postPassword" name="postPassword" placeholder="추억 비밀번호를 생성해 주세요" value={postPassword} onChange={(e) => setPostPassword(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="groupPassword">그룹 비밀번호 확인</label>
                        <input type="password" id="groupPassword" name="groupPassword" placeholder="그룹 비밀번호를 입력해 주세요" value={groupPassword} onChange={(e) => setGroupPassword(e.target.value)} />
                    </div>

                    <button type="submit">Submit</button>
                    {showModal && <Modal message={message} onClose={handleCloseModal} />}
                </form>                
            </main>
        </div>
    );
}

export default MakePost;