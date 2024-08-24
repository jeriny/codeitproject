import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Group.css';
import groupIcon from '../assets/groupicon.svg';

function Group() {
  const [groups, setGroups] = useState([]); 
  const [sortBy, setSortBy] = useState('latest'); 
  const [keyword, setKeyword] = useState(''); 
  const [isPublic, setIsPublic] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const navigate = useNavigate(); 


  const fetchGroups = async (page = 1) => {
    try {
      const response = await axios.get('https://zogakzip-api-gr4l.onrender.com/api/groups', {
        params: {
          page,
          pageSize: 16,
          sortBy,
          keyword,
          isPublic 
        }
      });
      console.log(isPublic);
      console.log('응답 데이터:', response.data);
      setGroups(prevGroups => page === 1 ? response.data.data : [...prevGroups, ...response.data.data]);
      setTotalPages(response.data.totalPages); 
    } catch (error) {
      console.error('그룹 목록을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const checkGroupPublicStatus = async (groupId) => {
    try {
      const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/is-public`);
      return response.data.isPublic;
    } catch (error) {
      console.error('그룹 공개 여부 확인 중 오류가 발생했습니다:', error);
      return false; 
    }
  };
 
  const handleGroupClick = async (groupId) => {
    const isPublic = await checkGroupPublicStatus(groupId);
    if (isPublic) {
      navigate(`/group/${groupId}`);
    } else {
      navigate(`/group-access/${groupId}`);
    }
  };

 
  const handleCreateGroupClick = () => {
    navigate('/makegroup'); 
  };

 
  useEffect(() => {
    fetchGroups();
  }, [sortBy, keyword, isPublic]);

  const handlePublicClick = () => {
    if (!isPublic) { 
      setIsPublic(true);
      setCurrentPage(1); 
      fetchGroups(1); 
    }
  };

  const handlePrivateClick = () => {
    if (isPublic) { 
      setIsPublic(false);
      setCurrentPage(1); 
      fetchGroups(1); 
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
      fetchGroups(nextPage);
    }
  };

  const calculateDDay = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference >= 0 ? `D+${dayDifference}` : `D${dayDifference}`;
  };

  return (
    <div>
      <button 
        className="register-group-btn-right" 
        onClick={handleCreateGroupClick}
      >
        그룹 만들기
      </button>
      <div className="group-type">
        <button 
          className={isPublic ? 'show-public-group active' : 'show-public-group'}
          onClick={handlePublicClick} 
        >
          공개
        </button>
        <button 
          className={!isPublic ? 'show-private-group active' : 'show-private-group'}
          onClick={handlePrivateClick} 
        >
          비공개
        </button>
      </div>
      <div className="search-group">
        <input 
          className="search-bar-group" 
          type="text" 
          placeholder="그룹명을 입력해주세요" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <select 
        className="sort-dropdown" 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="latest">최신순</option>
        <option value="mostPosted">게시글 많은 순</option>
        <option value="mostLiked">공감순</option>
        <option value="mostBadge">획득 뱃지순</option>
      </select>

      <div className="group-content">
        {groups.length === 0 ? (
          <div className="no-groups-message">
            <img src={groupIcon} className="group-icon-img" alt="그룹 아이콘" />
            <p className="none-group-text">등록된 그룹이 없습니다.</p>
            <p className="make-group-text">가장 먼저 그룹을 만들어보세요!</p>
            <button 
              className="register-group-btn-center" 
              onClick={handleCreateGroupClick} 
            >
              그룹 만들기
            </button>
          </div>
        ) : (
          <div>
            <div className="group-list">
              {groups.map(group => (
                <div 
                  key={group.id} 
                  className="group-item-link"
                  onClick={() => handleGroupClick(group.id)} 
                >
                  <div className="group-item">
                    {isPublic && group.imageUrl && (
                      <img 
                        src={group.imageUrl} 
                        alt={group.name} 
                        className="group-image" 
                      />
                    )}

                    <div className="group-info">
                      <div>
                        <span>{calculateDDay(group.createdAt)}  </span>
                        <span>|</span>
                        <span>{group.isPublic ? '공개' : '비공개'}</span>
                      </div>
                      <h3>{group.name}</h3>
                      {isPublic && <p>{group.introduction}</p>}
                      <div className="group-stats">
                        {isPublic && <span>획득 뱃지 {group.badgeCount} </span>}
                        <span>공감 {group.likeCount} </span>
                        <span>추억 {group.postCount} </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  더보기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Group;
