import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';  
import axios from 'axios';
import PostDeleteModal from '../components/PostDeleteModal';
import PostEditModal from '../components/PostEditModal';

import CommentList from '../components/CommentList';
import CommentRegisterModal from '../components/CommentRegisterModal';

function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [localLikeCount, setLocalLikeCount] = useState(0);
    const [postData, setPostData] = useState({
        id: 123,
        groupId: 123,
        nickname: "string",
        title: "string",
        content: "string",
        imageUrl: "string",
        tags: ["string", "string"],
        location: "string",
        moment: "2024-02-21",
        isPublic: true,
        likeCount: 0,
        commentCount: 0,
        createdAt: "2024-02-22T07:47:49.803Z"
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [refreshComments, setRefreshComments] = useState(false); 

    const handleDelete = () => {
        navigate(`/`);  
        setDeleteModalOpen(false);
    };

    const handleEdit = () => {
        navigate(`/group/${groupId}`)
        setEditModalOpen(false);
    };

    const handleCommentRegistered = () => {
        setRegisterModalOpen(false);
        setRefreshComments(prev => !prev); 
    };

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}`);
                setPostData(response.data); 
                setLocalLikeCount(response.data.likeCount);
            } catch (error) {
                setErrorMessage('게시글 정보를 가져오는 데 실패했습니다.');
                console.error('Error fetching post details:', error);
            }
        };
        
        fetchPostData();
    }, [postId]);

    const sendClick = async () => {
        try {
            const response = await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}/like`);
            setLocalLikeCount(prevCount => prevCount + 1); 
        } catch (error) {
            setErrorMessage('공감 보내기 실패');
            console.error('Error sending like:', error);
        }
    };

    return (
        <div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="PD-post-detail">
                <div className="PD-top-info">
                    <p>{postData.nickname}</p>
                    <p className="PD-ispublic-info">
                        |<span style={{ marginLeft: '8px' }}>{postData.isPublic ? '공개' : '비공개'}</span>
                    </p>
                </div>
                <h1 className="PD-title">{postData.title}</h1>
                <button className="PD-edit-btn" onClick={() => setEditModalOpen(true)}>추억 수정하기</button>                
                <PostEditModal
                    isOpen={editModalOpen}
                    onRequestClose={() => setEditModalOpen(false)}
                    onEdit={handleEdit}
                    groupId={postId}
                />
                <button className="PD-delete-btn" onClick={() => setDeleteModalOpen(true)}>추억 삭제하기</button>
                <PostDeleteModal
                    isOpen={deleteModalOpen}
                    onRequestClose={() => setDeleteModalOpen(false)}
                    onDelete={handleDelete}
                    postId={postId}
                />
                <p className="PD-tags">#{postData.tags.join('   #')}</p>
                <div className="PD-btm-info">
                    <p>{postData.location}</p>
                    <p>·   {new Date(postData.createdAt).toLocaleDateString()}</p>
                    <p>공감: {localLikeCount} · 댓글: {postData.commentCount}</p>
                </div>
                <button className="PD-send-like-btn" onClick={sendClick}>공감 보내기</button>
                <hr className="PD-hr-post"/>
                <img src={postData.imageUrl} alt={postData.title} className="PD-post-image" />

                <div className="PD-post-comment-box">
                    
                    <div className="PD-post-content-wrapper">
                        
                        <div className="PD-post-box">
                            <p className="PD-post-content">{postData.content}</p>
                            <button className="PD-comment-btn" onClick={() => setRegisterModalOpen(true)}>
                                댓글 등록하기
                            </button>
                        </div>
                        <div className="PD-comment-wrapper">
                            <CommentList
                                postId={postId}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                refreshComments={refreshComments} 
                            />
                        </div>  
                    </div>
                                                      
                </div>
            </div>
            <CommentRegisterModal
                isOpen={registerModalOpen}
                onRequestClose={() => setRegisterModalOpen(false)}
                postId={postId}
                onCommentRegistered={handleCommentRegistered}
            />
        </div>
    );
}

export default PostDetail;