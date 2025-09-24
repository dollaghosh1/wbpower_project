import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api"; // axios instance
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default function PostForm() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true); // For edit mode
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Post ID from route param, if any
  const [content, setContent] = useState('<p>Write something...</p>');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      content: '<p>Write something...</p>'
    }
     });
  // Fetch categories on mount

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const res = await api.get("/allpostcategory");
        setCategories(res.data.data); // {id, category_name}
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch post data if editing (id is present)
  useEffect(() => {
    //console.log(id)
    if (!id) {
      setLoadingPost(false);
      return; // No id = add mode
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/postdetails/${id}`); // adjust endpoint as needed
        const post = res.data.data;
        console.log(post)
    
        // Populate form fields
        setValue("title", post.post_name);
        setValue("content", post.post_desc);
        setValue("category", post.post_category_id);
        setPreview(`${import.meta.env.VITE_IMG_URL}/${post.post_image}`);
    
        // Note: For image, can't set file input programmatically (browser security)
        // You may want to show current image preview separately if needed

      } catch (error) {
        console.error("Failed to fetch post data:", error);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [id, setValue]);
  useEffect(() => {
    register('content', { required: "Content is required" });
  }, [register]);

  // Optional: watch content if you want
  const contentValue = watch('content');
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("post_name", data.title);
      formData.append("post_desc", data.content);
      formData.append("post_category_id", data.category);

      if (data.image && data.image[0]) {
        formData.append("post_image", data.image[0]);
      }

      let response;
      if (id) {
        // Edit mode: PUT or PATCH to update endpoint
        response = await api.post(`/updatepost/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Post updated:", response.data);
      } else {
        // Add mode: POST to create endpoint
        response = await api.post("/addpost", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Post created:", response.data);
      }

      reset();
      navigate("/post");
    } catch (error) {
      console.error(
        id ? "Failed to update post:" : "Failed to create post:",
        error.response?.data || error.message
      );
    }
  };

  if (loadingCategories || loadingPost) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
  
            <div>
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
              <div class="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 class="text-white text-capitalize ps-3">Post /   {id ? "Edit" : "Create"}</h6>
              </div>
            </div>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans "
    >
   

      {/* Title */}
      <div className="mb-3">
        <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Enter post title"
          className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        <label htmlFor="content" className="block mb-1 font-medium text-gray-700">
          Content
        </label>
        {/* <textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          placeholder="Enter post content"
          rows={5}
          className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
            errors.content ? "border-red-500" : "border-gray-300"
          }`}
        /> */}
        <CKEditor
        editor={ClassicEditor}
        data={contentValue}
        onChange={(event, editor) => {
          const data = editor.getData();
          setValue('content', data, { shouldValidate: true }); // update RHF form state & validate
        }}
      />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Category Select */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Category select */}
  <div className="mb-3">
    <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
      Category
    </label>
    <select
      id="category"
      {...register("category", { required: "Please select a category" })}
      className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        errors.category ? "border-red-500" : "border-gray-300"
      }`}
      defaultValue=""
    >
      <option value="" disabled>
        Select category
      </option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.category_name}
        </option>
      ))}
    </select>
    {errors.category && (
      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
    )}
  </div>

  {/* File Upload */}
<div className="mb-5">
  <label htmlFor="image" className="block mb-1 font-medium text-gray-700">
    Upload Image
  </label>

  <div className="w-full flex justify-start items-start space-x-4 gap-3">
    

    {/* File Input */}
    <div className="basis-3/4">
    <input
      type="file"
      id="image"
      accept="image/*"
      {...register("image", {
        required: id ? false : "Image is required",
      })}
      className={`block px-2 py-2 border rounded-lg w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        errors.image ? "border-red-500" : "border-gray-300"
      }`}
    />
    </div>
    {/* Image Preview */}
    <div>
    {preview && (
      <img
        className="w-20 h-20 rounded-md object-cover border"
        src={preview}
        alt="Image Preview"
      />
    )}
    </div>
  </div>

  {errors.image && (
    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
  )}
</div>

</div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`p-head w-btn py-2 text-white font-semibold rounded-lg transition ${
          isSubmitting
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isSubmitting ? (id ? "Updating..." : "Submitting...") : id ? "Update" : "Create"}
      </button>
    </form>
    </div>
  );
}