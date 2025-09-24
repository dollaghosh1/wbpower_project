import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import api from "../../../api/api"; // axios instance

export default function SliderList({ id, initialStatus, onStatusChange }) {
  const [Sliders, setSliders] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [SlidersPerPage] = useState(7);
  const [sortOrder, setSortOrder] = useState("newest"); // <-- New state for sorting

  const navigate = useNavigate();

  useEffect(() => {
        const fetchSliders = async () => {
      try {
        const res = await api.get("/allslider");
       const formatted = res.data.data.map((p) => ({
        id: p.id,
        Slider_name: p.slider_name,
        Slider_desc: p.slider_desc,
        Slider_image: p.slider_image
          ? `${import.meta.env.VITE_IMG_URL}/${p.slider_image}`
          : null,
        createdAt: p.createdAt || p.created_at || null,
       is_active: p.is_active, // ✅ add this
      }));
        setSliders(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    };
    fetchSliders();
  }, []);
 


  // Filter and sort Sliders
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    // Filter by search first
    let result = !q
      ? Sliders
      : Sliders.filter((p) =>
          [p.id?.toString(), p.slider_name, p.slider_desc].some((field) =>
            (field ?? "").toLowerCase().includes(q)
          )
        );

    // Sort by date
    result = result.slice().sort((a, b) => {
      // Use a fallback date if missing
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, Sliders, sortOrder]);

  // Pagination
  const indexOfLastSlider = currentPage * SlidersPerPage;
  const indexOfFirstSlider = indexOfLastSlider - SlidersPerPage;
  const currentSliders = filtered.slice(indexOfFirstSlider, indexOfLastSlider);
  const totalPages = Math.ceil(filtered.length / SlidersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const AddSlider = () => navigate("/sliderform");
  const handleEdit = (Slider) => navigate(`/sliderform/${Slider.id}`);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this Slider?")) {
        await api.delete(`/deleteslider/${id}`);
        setSliders((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete Slider:", error);
      alert("Failed to delete Slider.");
    }
  };
const toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus ? 0 : 1;

  try {
    await api.put(`/updatesliderstatus/${id}`, { is_active: newStatus });

    setSliders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_active: newStatus } : p
      )
    );
  } catch (error) {
    console.error("Failed to update status", error);
    alert("Failed to update status");
  }
};


  return (
    <div className="list">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins text-2xl"></h1>

        <div className="flex gap-3 items-center">
          {/* Search */}
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

          {/* Sort by newest/oldest */}
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
            onClick={AddSlider}
            className="flex items-center gap-2 px-4 py-2 p-head text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>

      {pending ? (
        <div className="p-6 text-gray-500">Loading Sliders...</div>
      ) : (
        <>
          {/* Table */}
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">Slider / List</h6>
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                <tr>
                  <th className="px-6 pb-3  pt-5 text-left">SL no</th>
                  <th className="px-6 pb-3 pt-5 text-left">Slider Image</th>
                  <th className="px-6 pb-3 pt-5 text-left">Slider Title</th>
                  <th className="px-6 pb-3 pt-5 text-left">Slider Body</th>
                  <th className="px-6 pb-3 pt-5 text-left">Status</th>
                  <th className="px-6 pb-3 pt-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSliders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No Sliders found
                    </td>
                  </tr>
                ) : (
                  currentSliders.map((Slider, index) => (
                    
                    <tr
                      key={Slider.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2  table-data font-medium">
                        {indexOfFirstSlider + index + 1}
                      </td>
                      <td className="px-4 py-2 table-data">
                        {Slider.Slider_image ? (
                          <img
                            src={Slider.Slider_image}
                            alt="Slider"
                            className="w-8 h-8 object-cover rounded-lg border"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-2 table-data font-semibold">
                        {Slider.Slider_name}
                      </td>
                      <td className="px-4 py-2 table-data text-gray-600 ">
                        {Slider.Slider_desc}
                      </td>
                     <td className="px-4 py-2 table-data">
                            <p
                        onClick={() => toggleStatus(Slider.id, Slider.is_active)}
                        className={`cursor-pointer mb-0  line-height-0 font-semibold ${
                          Number(Slider.is_active) === 1 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {Number(Slider.is_active) === 1 ? "Active" : "Inactive"}
                      </p>
                      </td>
                      <td className="px-4 py-2 flex justify-center gap-2 table-data">
                        <button
                          onClick={() => handleEdit(Slider)}
                          className="p-2 rounded-lg text-blue-600 transition"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(Slider.id)}
                          className="p-2 rounded-lg text-red-600 transition"
                        >
                          <FiTrash2 size={15} />
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
  );
}