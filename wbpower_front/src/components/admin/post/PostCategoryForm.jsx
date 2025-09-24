import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api"; // axios instance
import { useNavigate, useParams } from "react-router-dom";


export default function PostCategoryForm() {
  const [categories, setCategories] = useState([]);
  //const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPostCategories, setLoadingPostCategories] = useState(true); // For edit mode
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Post ID from route param, if any


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

   

  // Function to generate the slug from the category name
  const generateSlug = (category_name) => {
    return category_name
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric characters except space and hyphen
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '_'); // Replace multiple hyphens with a single one
  };

  // Handle category name change
  const handleNameChange = (e) => {
    const category_name = e.target.value;
    setCategoryName(category_name);

    // Generate and update the slug when category name changes
    const generatedSlug = generateSlug(category_name);
    setSlug(generatedSlug);
  };

  // Fetch categories on mount
  // useEffect(() => {
    
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await api.get("/allpostcategory");
  //       setCategories(res.data.data); // {id, category_name}
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //     } finally {
  //       setLoadingCategories(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // Fetch post data if editing (id is present)
  useEffect(() => {
    //console.log(id)
    if (!id) {
      setLoadingPostCategories(false);
      return; // No id = add mode
    }

    const fetchPostCategories = async () => {
      try {
        const res = await api.get(`/postcategorydetails/${id}`); // adjust endpoint as needed
        const postcategory = res.data.data;
       // console.log(postcategory)
    
        // Populate form fields
        setValue("category_name", postcategory.category_name);
        setValue("category_slug", postcategory.category_slug);
        setValue("category_desc", postcategory.category_desc);
      //  setValue("category", post.post_category_id);
      //  setPreview(`${import.meta.env.VITE_IMG_URL}/${post.post_image}`);
    
        // Note: For image, can't set file input programmatically (browser security)
        // You may want to show current image preview separately if needed

      } catch (error) {
        console.error("Failed to fetch post data:", error);
      } finally {
        setLoadingPostCategories(false);
      }
    };

    fetchPostCategories();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
        const jsonData = {
      category_name: data.category_name,
      category_slug: data.category_slug,
      category_desc: data.category_desc,
      //formData.append("post_category_id", data.category);

      // if (data.image && data.image[0]) {
      //   formData.append("post_image", data.image[0]);
      // }
        }
      let response;
      if (id) {
        // Edit mode: PUT or PATCH to update endpoint
        response = await api.put(`/updatepostcategory/${id}`,jsonData);
        console.log("Post Category updated:", response.data);

      } else {
        // Add mode: POST to create endpoint
        console.log(jsonData);
        response = await api.post("/addpostcategory", jsonData);
        
        console.log("Post Category created:", response.data);
      }

      reset();
      navigate("/post-category");
    } catch (error) {
      console.error(
        id ? "Failed to update post:" : "Failed to create post:",
        error.response?.data || error.message
      );
    }
  };

  if (loadingPostCategories) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
      <div>
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
              <div class="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 class="text-white text-capitalize ps-3">Post Category /   {id ? "Edit" : "Create"}</h6>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" p-frm bg-white rounded-2xl shadow-lg font-sans "
            >

              {/* Title */}
              <div className="mb-3">
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
                  Caegory Name
                </label>
                <input
                  id="category_name"
                  {...register("category_name", { required: "Caegory Name is required" })}
                  placeholder="Enter post Caegory Name"
                  value={categoryName}
                  onChange={handleNameChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.category_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_name.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
                  Caegory Slug
                </label>
                <input
                  id="category_slug"
                  {...register("category_slug", { required: "Caegory Slug is required" })}
                  value={slug}
                  placeholder="Slug will be generated" readOnly
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.category_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_name.message}</p>
                )}
              </div>

              {/* Content */}
              <div className="mb-5">
                <label htmlFor="content" className="block mb-1 font-medium text-gray-700">
                  Category Description
                </label>
                <textarea
                  id="category_desc"
                  {...register("category_desc", { required: "Category desc is required" })}
                  placeholder="Enter post category desc"
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
                    errors.category_desc ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.category_desc && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_desc.message}</p>
                )}
              </div>

              {/* Category Select */}
              {/* <div className="mb-3">
                <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
                  Parent Category
                </label>
                <select
                  id="category"
                  {...register("category", { required: "Please select a category" })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
              </div> */}

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