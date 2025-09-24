import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api"; // axios instance
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default function SliderForm() {
  const [loadingSlider, setLoadingSlider] = useState(true); // For edit mode
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Slider ID from route param, if any
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



  // Fetch Slider data if editing (id is present)
  useEffect(() => {
    //console.log(id)
    if (!id) {
      setLoadingSlider(false);
      return; // No id = add mode
    }

    const fetchSlider = async () => {
      try {
        const res = await api.get(`/sliderdetails/${id}`); // adjust endpoint as needed
        const Slider = res.data.data;
        console.log(Slider)
    
        // Populate form fields
        setValue("title", Slider.slider_name);
        setValue("content", Slider.slider_desc);
        setPreview(`${import.meta.env.VITE_IMG_URL}/${Slider.slider_image}`);
    
        // Note: For image, can't set file input programmatically (browser security)
        // You may want to show current image preview separately if needed

      } catch (error) {
        console.error("Failed to fetch Slider data:", error);
      } finally {
        setLoadingSlider(false);
      }
    };

    fetchSlider();
  }, [id, setValue]);
  useEffect(() => {
    register('content', { required: "Content is required" });
  }, [register]);

  // Optional: watch content if you want
  const contentValue = watch('content');
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("slider_name", data.title);
      formData.append("slider_desc", data.content);

      if (data.image && data.image[0]) {
        formData.append("slider_image", data.image[0]);
      }

      let response;
      if (id) {
        // Edit mode: PUT or PATCH to update endpoint
        response = await api.post(`/updateslider/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Slider updated:", response.data);
      } else {
        // Add mode: Slider to create endpoint
        response = await api.post("/addslider", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Slider created:", response.data);
      }

      reset();
      navigate("/slider");
    } catch (error) {
      console.error(
        id ? "Failed to update Slider:" : "Failed to create Slider:",
        error.response?.data || error.message
      );
    }
  };

  if (loadingSlider) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
  
            <div>
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">Slider /   {id ? "Edit" : "Create"}</h6>
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
          placeholder="Enter Slider title"
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
          placeholder="Enter Slider content"
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

    <div className="mb-3">
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
        errors.slider_image ? "border-red-500" : "border-gray-300"
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