import { useState } from "react";
import UserProfile from './userprofile/UserProfile';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authSlice';
import {
  MdMenu,
} from "react-icons/md";

const AdminHeader = ({ setSidebarOpen }) => {
  const user = useSelector(selectAuthUser);
  return (
    <header className='h-area'>
       <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 md:hidden"
      >
        <MdMenu size={24} />
      </button>
     <h6 className='h-text'> 
      Admin
      {user && (
          <span style={{ marginLeft: '10px', fontWeight: 'normal' }}>
            | {user.name }
          </span>
        )}
      </h6>
      <UserProfile />
    </header>
  );
};

export default AdminHeader;