import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import GroupDetail from './pages/GroupDetail';
import Group from './pages/Group';
import GroupAccess from './pages/GroupAccess';
import MakeGroup from './pages/MakeGroup';
import PostAccess from './pages/PostAccess';
import MakePost from './pages/MakePost';
import PostDetail from './pages/PostDetail';

function Main() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Group />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/group-access/:groupId" element={<GroupAccess />} />
          <Route path="/makegroup" element={<MakeGroup />} />
          <Route path="/group/:groupId/:postId" element={<PostDetail />} />
          <Route path="/group/:groupId/post-access/:postId" element={<PostAccess />} />
          <Route path="/group/:groupId/MakePost" element={<MakePost />} />
        </Routes>
      </App>    
    </BrowserRouter>
  );
}

export default Main;