import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";


export default function PostCategoryList() {
  const [postcategory, setPostcategory] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Adjust posts per page
  const navigate = useNavigate();

  // Fetch posts using global Axios instance
  useEffect(() => {
    const fetchPostCategory = async () => {
      try {
        const res = await api.get("/allpostcategory");
        const formatted = res.data.data.map((p) => ({
          id: p.id,
          category_name: p.category_name,
          category_desc: p.category_desc,
        }));
        setPostcategory(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    };

    fetchPostCategory();
  }, []);

  // Filter posts based on search query
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return postcategory;
    return postcategory.filter((p) => {
      const id = (p.id ?? "").toString().toLowerCase();
      const title = (p.category_name ?? "").toLowerCase();
      const body = (p.category_desc ?? "").toLowerCase();
      return id.includes(q) || title.includes(q) || body.includes(q);
    });
  }, [search, postcategory]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPostcategory = filtered.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Placeholder edit/delete actions
   const AddPostCategory = () => navigate("/post-category-form");
  const handleEdit = (post) => navigate(`/post-category-form/${post.id}`);
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this post category?")) {
        await api.delete(`/deletepostcategory/${id}`);
        setPostcategory((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post category:", error);
      alert("Failed to delete post category.");
    }
  };

  return (
  <div className="list">
    <div className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins text-2xl">
        </h1>
       <div className="flex gap-3 items-center">
        <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
              type="text"
              placeholder="Search by id, title, body…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
        </div>
       <button
                   onClick={AddPostCategory}
                   className="flex items-center gap-2 px-4 py-2 p-head text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                 >
                   Create
        </button>
      </div>
      </div>

      {pending ? (
        <div className="">Loading posts category...</div>
      ) : (
        <>
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">Post Category / List</h6>
            </div>
          </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-6 py-3 pt-5 text-left text-xs font-medium text-gray-500 uppercase">SL No</th>
                <th className="px-6 py-3 pt-5 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 pt-5  text-left text-xs font-medium text-gray-500 uppercase">Body</th>
                <th className="px-6 py-3 pt-5  text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
              {currentPostcategory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No posts category found
                  </td>
                </tr>
              ) : (
                currentPostcategory.map((post, index) => (
                  <tr key={post.id}>
                    <td className="px-4 py-2 font-medium">{indexOfFirstPost + index + 1}</td>
                    <td className="px-4 py-2 font-semibold">{post.category_name}</td>
                    <td className="px-4 py-2 text-gray-600 ">{post.category_desc}</td>
                    <td className="px-4 py-2 flex  gap-2">
                      <button onClick={() => handleEdit(post)}   className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(post.id)}  className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
           </div>
                {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  {/* Prev */}
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronLeft className="w-5 h-5" />
                  </button>
              
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded border text-sm transition ${
                        currentPage === i + 1
                          ? "p-head text-white border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
              
                  {/* Next */}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
        </>
      )}
    </div>
   </div>
  );
};