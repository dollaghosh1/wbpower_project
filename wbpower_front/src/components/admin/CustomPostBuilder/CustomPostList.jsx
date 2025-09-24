import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import api from "../../../api/api";

export default function CustomPostList({ tableName }) {
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [sortOrder, setSortOrder] = useState("newest");

  const navigate = useNavigate();

  useEffect(() => {
    if (!tableName) return;

    const fetchPosts = async () => {
      setPending(true);
      try {
        const res = await api.get(`/custom-post/list/${tableName}`);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    };

    fetchPosts();
  }, [tableName]);

  // Filter & sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = !q
      ? posts
      : posts.filter((p) =>
          Object.values(p).some(
            (val) => val && val.toString().toLowerCase().includes(q)
          )
        );

    result = result.slice().sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, posts, sortOrder]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Actions
  const handleAdd = () => navigate(`/custom-post-form/${tableName}`);
  const handleEdit = (post) => navigate(`/custom-post/edit/${tableName}/${post.id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/custom-post/delete/${tableName}/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;
    try {
      await api.put(`/custom-post/status/${tableName}/${id}`, { is_active: newStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: newStatus } : p))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="list">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins">
          {/* Optional Title */}
        </h1>

        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by any field..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* Add Button */}
          <button
            onClick={handleAdd}
           className="flex items-center gap-2 px-4 py-2 p-head text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
         Create
          </button>
        </div>
      </div>

      {pending ? (
        <div className="p-6 text-gray-500">Loading posts...</div>
      ) : (
        <>
          {/* Table Header */}
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">
                {tableName.replace("custompost_", "")} / List
              </h6>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                <tr>
                  <th className="px-6 pb-3 pt-5 text-left">SL no</th>
                  {currentPosts[0] &&
                    Object.keys(currentPosts[0])
                      .filter((col) => col !== "id" && col !== "is_active") // exclude is_active here
                      .map((col, idx) => (
                        <th key={idx} className="px-6 pb-3 pt-5 text-left">
                          {col.replace("_", " ").toUpperCase()}
                        </th>
                      ))}
                  <th className="px-6 pb-3 pt-5 text-center">Status</th>
                  <th className="px-6 pb-3 pt-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500 italic">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post, idx) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 table-data font-medium">
                        {indexOfFirstPost + idx + 1}
                      </td>
                      {Object.keys(post)
                        .filter((col) => col !== "id" && col !== "is_active") // exclude is_active here too
                        .map((col, cIdx) => {
                          const value = post[col];
                          if (
                            typeof value === "string" &&
                            value.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                          ) {
                            return (
                              <td key={cIdx} className="px-4 py-2 table-data">
                                <img
                                  src={`${import.meta.env.VITE_IMG_URL}/${value}`}
                                  alt={col}
                                  className="w-8 h-8 object-cover rounded-lg border"
                                />
                              </td>
                            );
                          }
                          return (
                            <td key={cIdx} className="px-4 py-2 table-data font-medium">
                              {value}
                            </td>
                          );
                        })}
                      {/* Status toggle */}
                      <td className="px-4 py-2 table-data font-medium text-center">
                        <span
                          onClick={() => toggleStatus(post.id, Number(post.is_active) || 0)}
                          className={`cursor-pointer text-sm font-semibold px-2 py-1 rounded-full ${
                            Number(post.is_active) === 1
                              ? "text-green-600 bg-green-100"
                              : "text-red-600 bg-red-100"
                          }`}
                          title="Toggle Status"
                        >
                          {Number(post.is_active) === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-2 table-data font-medium text-center">
                        <div className="flex items-center gap-3 justify-center">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
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
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdChevronLeft className="w-5 h-5" />
              </button>

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
  );
}
