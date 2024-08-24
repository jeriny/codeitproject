import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentList.css';
import CommentEditModal from './CommentEditModal'; 
import CommentDeleteModal from './CommentDeleteModal'; 

const CommentList = ({ postId, currentPage, setCurrentPage }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null); 

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}/comments?page=${currentPage}&pageSize=3`);
                setComments(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, currentPage]);


    const handleEdit = async (commentId, updatedContent) => {
        try {
            await axios.put(`https://zogakzip-api-gr4l.onrender.com/api/comments/${commentId}`, { content: updatedContent });
            setEditModalOpen(false);
            // 업데이트 후 댓글 리스트를 다시 불러오거나 상태를 갱신할 필요가 있습니다.
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`https://zogakzip-api-gr4l.onrender.com/api/comments/${commentId}`);
            setDeleteModalOpen(false);
            // 삭제 후 댓글 리스트를 다시 불러오거나 상태를 갱신할 필요가 있습니다.
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="CL-comment-wrapper">
            <p>댓글</p>
            <hr className="CL-hr-comment"/>
            <div>
                {loading && <p>댓글을 불러오는 중입니다...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && comments.length === 0 && <p>댓글이 없습니다.</p>}
                {!loading && !error && comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        
                        <div>
                            <p className="comment-nickname">{comment.nickname}</p> 
                            <p className="comment-createdAt">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="comment-content">{comment.content}</p>       
                        <button className="CL-edit-btn" onClick={() => { setSelectedCommentId(comment.id); setEditModalOpen(true); }}>수정</button>
                        <button className="CL-delete-btn" onClick={() => { setSelectedCommentId(comment.id); setDeleteModalOpen(true); }}>삭제</button>
                        <hr className="CL-hr-item"/>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    다음
                </button>
            </div>

            {editModalOpen && 
                <CommentEditModal
                    isOpen={editModalOpen}
                    onRequestClose={() => setEditModalOpen(false)}
                    onCommentUpdated={() => setCurrentPage(currentPage)}  // 상태 업데이트
                    commentId={selectedCommentId}
                />
            }
            {deleteModalOpen && 
                <CommentDeleteModal
                    isOpen={deleteModalOpen}
                    onRequestClose={() => setDeleteModalOpen(false)}
                    onCommentDeleted={() => handleDelete(selectedCommentId)}
                    commentId={selectedCommentId}
                />
            }
        </div>
    );
};

export default CommentList;