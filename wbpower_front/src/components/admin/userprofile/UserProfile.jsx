import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import defaultAvatar from '../../../assets/images/admin/avatar.jpg';

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(defaultAvatar);

  const toggleDropdown = () => setOpen(!open);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // redirect after logout
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <img
        src={preview}
        alt="User Avatar"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={toggleDropdown}
      />
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="">
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-2 text-sm text-gray-700 text-logout"
            >
              Sign out &nbsp; <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;