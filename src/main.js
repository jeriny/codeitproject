import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import GroupDetail from './pages/GroupDetail';
import Group from './pages/Group';
import GroupAccess from './pages/GroupAccess';
import MakeGroup from './pages/MakeGroup';

function Main() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Group />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/group-access" element={<GroupAccess />} />
          <Route path="/makegroup" element={<MakeGroup />} />
        </Routes>
      </App>    
    </BrowserRouter>
  );
}

export default Main;