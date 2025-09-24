import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import defaultAvatar from '../../../assets/images/admin/avatar.jpg';
import api from "../../../api/api"; // axios instance
//import './UserProfileForm.css';

const schema = Yup.object().shape({
  name: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^\+?\d{10,14}$/, 'Invalid phone number'),
});

const UserProfileForm = () => {
const [preview, setPreview] = useState(defaultAvatar);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //     setValue('avatar', file);
  //   }
  // };

  // const onSubmit = (data) => {
  //   console.log('Form Submitted:', data);
  //   alert('Profile updated successfully!');
  // };

   useEffect(() => {
    const fetchUser = async () => {
      
      try {
          const { data } = await api.get(`/userdetails`);
      //   console.log(data.data);
        reset({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          user_address: data.data.additional_detail?.user_address || "",
          //user_image: data.data.additional_detail.user_image,
          
        });
       const user_image = data.data.additional_detail.user_image;
       
        if (user_image) {
           setPreview(`${import.meta.env.VITE_IMG_URL}/${user_image}`);

        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setLoading(false);
      }
    };

    fetchUser();
  },[reset]);

  // ✅ Avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue('user_image', file);
    }
  };

  // ✅ Submit updated user data
  const onSubmit = async (formData) => {
    try {
      const formDataToSend = new FormData();
      console.log(formDataToSend);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('user_address', formData.user_address);

      if (formData.user_image) {
        formDataToSend.append('user_image', formData.user_image);
      }

      await api.post(`/updateuserdetails`, formDataToSend,
        {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      );
        setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (error) {
       setErrorMessage('Update failed');
       setTimeout(() => setErrorMessage(''), 1000);
     // console.error('Update failed:', error);
     // alert('Update failed!');
    }
  };

  return (
     <div>
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
              <div class="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 class="text-white text-capitalize ps-3"> User Profile Details</h6>
              </div>
            </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" p-frm bg-white rounded-2xl shadow-lg font-sans "
          >
         
            <div className="flex flex-col md:flex-row gap-10">
              {/* LEFT: Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="mb-3">
                  <label className="block font-medium mb-1">Full Name:</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full border rounded-lg border-gray-300  px-4 py-2"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="block font-medium mb-1">Email:</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full border rounded-lg border-gray-300  px-4 py-2"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="block font-medium mb-1">Phone:</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full border rounded-lg border-gray-300  px-4 py-2"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="block font-medium mb-1">Address:</label>
                  <textarea
                    id="user_address"
                    {...register("user_address", { required: "User Address is required" })}
                    placeholder="Enter User Addressz"
                    className="w-full border rounded-lg border-gray-300  px-4 py-2"
                  />
                  {errors.user_address && <p className="text-red-500 text-sm">{errors.user_address.message}</p>}
                </div>
              </div>

              {/* RIGHT: Avatar Upload + Preview */}
              <div className="w-full md:w-1/3 text-center space-y-4">
                <div className="flex flex-col items-center">
        <img
          alt="Avatar Preview"
          className="w-32 h-32 rounded-full object-cover border shadow mb-4"
          src="http://127.0.0.1:8000/images/user/1757491419.jpg"
        />

        {/* Hidden native file input */}
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            // handle file selection here
          }}
        />

        {/* Custom label styled as button */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg  text-gray-700 text-center hover:bg-gray-300 transition"
        >
          Choose an image
        </label>
      </div>

              </div>
            </div>

            <div className="mt-6 text-left">
              <button
                type="submit"
                className="p-head text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
              
            </div>
            {successMessage ? (
              <div className="success-message" style={{ color: 'green', marginTop: '10px' }}>
                {successMessage}
              </div>
            ) : errorMessage ? (
              <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
              </div>
            ) : null}
          </form>
    </div>
  );
};

export default UserProfileForm;