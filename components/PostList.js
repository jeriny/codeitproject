import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PostList.css'; 
import postIcon from '../assets/groupicon.svg'; 

function PostList() {

    const [posts, setPosts] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [keyword, setKeyword] = useState(''); 
    const [sortOrder, setSortOrder] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { groupId } = useParams();
    const navigate = useNavigate();

    const checkPostPublicStatus = async (postId) => {
        try {
            const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/posts/${postId}/is-public`);
            return response.data.isPublic;
        } catch (error) {
            console.error('게시물 공개 여부 확인 중 오류가 발생했습니다:', error);
            return false; 
        }
    };

    
    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/posts`, {
                params: {
                    page,
                    pageSize: 16, 
                    sortBy: sortOrder,
                    keyword,
                    isPublic,
                    groupId
                }
            });
            setPosts(prevPosts => page === 1 ? response.data.data : [...prevPosts, ...response.data.data]);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
            console.log(isPublic);
            console.log('응답 데이터:', response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = async (post) => {
        const isPublic = await checkPostPublicStatus(post.id);
        if (isPublic) {
            navigate(`/group/${groupId}/${post.id}`);
        } else {
            navigate(`/group-access`);
        }
    };


    const handleCreatePostClick = async () => {
        navigate(`/group/${groupId}/MakePost`);
      };
    
    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(1); 
        fetchPosts(1); 
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1); 
        fetchPosts(1); 
    };

    const handleVisibilityChange = (type) => {
        setIsPublic(type === 'public');
        setCurrentPage(1); 
        fetchPosts(1); 
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            fetchPosts(nextPage);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [sortOrder, keyword, isPublic]);

    return (
        <div>
            <div className="PL-post-type">
                <button 
                    className={isPublic ? 'PL-show-public-post active' : 'PL-show-public-post'} 
                    onClick={() => handleVisibilityChange('public')}
                >
                    공개
                </button>
                <button 
                    className={!isPublic ? 'PL-show-private-post active' : 'PL-show-private-post'} 
                    onClick={() => handleVisibilityChange('private')}
                >
                    비공개
                </button>
            </div>
            <div className="PL-search-post">
                <input 
                    className="PL-search-bar-post" 
                    type="text" 
                    placeholder="태그 혹은 제목을 입력해주세요" 
                    value={keyword}
                    onChange={handleSearchChange}
                />
            </div>
            <select 
                className="PL-sort-dropdown" 
                value={sortOrder} 
                onChange={handleSortChange}
            >
                <option value="latest">최신순</option>
                <option value="mostCommented">댓글순</option>
                <option value="mostLiked">공감순</option>
            </select>

            {loading && <p>로딩 중...</p>}
            {error && <p>오류 발생: {error}</p>}

            {posts.length === 0 && !loading ? (
                <div className="PL-no-posts-message">
                    <img src={postIcon} className="PL-post-icon-img" alt="검색 아이콘" />
                    <p className="PL-none-post-text">게시된 추억이 없습니다.</p>
                    <p className="PL-make-post-text">첫 번째 추억을 올려보세요!</p>
                    <button className="PL-register-post-btn-center" onClick={handleCreatePostClick} >추억 올리기</button>
                </div>
            ) : (
                <div className="PL-post-list">
                    {posts.map((post) => (
                        <div 
                            key={post.id} 
                            onClick={() => handlePostClick(post)} 
                            className="PL-post-item-link" 
                        >
                            <div className="PL-post-item">
                                {post.isPublic && post.imageUrl && (
                                    <img 
                                        src={post.imageUrl} 
                                        alt={post.title} 
                                        className="PL-post-image" 
                                    />
                                )}
                                <div className="PL-post-info">
                                    <div className="PL-top-info">
                                        <p>{post.nickname}</p>
                                        <p className="PL-ispublic-info">
                                            |<span style={{ marginLeft: '8px' }}>{post.isPublic ? '공개' : '비공개'}</span>
                                        </p>
                                    </div>
                                    <h3>{post.title}</h3>
                                    {post.isPublic ? (
                                        <>
                                            <p className="PL-tags">#{post.tags.join('   #')}</p>
                                            <div className="PL-btm-info">
                                                <p>{post.location}</p>
                                                <p>·   {new Date(post.createdAt).toLocaleDateString()}</p>
                                                <p>공감: {post.LikeCount} · 댓글: {post.commentCount}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="PL-private-info">
                                                <p>공감: {post.LikeCount} · 댓글: {post.commentCount}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {currentPage < totalPages && !loading && (
                <div className="PL-load-more-container">
                    <button className="PL-load-more-btn" onClick={handleLoadMore}>
                        더보기
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostList;
