import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { FiTrash2 } from "react-icons/fi";

function MenuForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      parent_id: "null",
    },
  });

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const normalizeTree = (items) => {
    return items.map((item) => ({
      ...item,
      children: item.children_recursive
        ? normalizeTree(item.children_recursive)
        : [],
    }));
  };

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await api.get("/menu-list");
        const rawData = res.data.data || [];
        const normalized = normalizeTree(rawData);
        setMenus(normalized);
      } catch (err) {
        console.error("Error fetching menus:", err);
      } finally {
        setLoadingMenus(false);
      }
    }
    fetchMenus();
  }, []);

  // Recursive remove node from tree
  const removeFromTree = (tree, idToRemove) => {
    return tree
      .map((node) => {
        if (node.id === idToRemove) {
          return null; // remove this node
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: removeFromTree(node.children, idToRemove),
          };
        }
        return node;
      })
      .filter(Boolean);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }
    try {
      await api.delete(`/deletemenu/${id}`);
      setMenus((prevMenus) => removeFromTree(prevMenus, id));
      setMessage("Menu item deleted successfully!");
      setSuccess(true);
    } catch (err) {
      console.error("Delete failed", err);
      setMessage("Failed to delete menu item.");
      setSuccess(false);
    }
  };

  const onSubmit = async (data) => {
    setMessage("");
    setSuccess(false);

    const payload = {
      title: data.title,
      url: data.url,
      parent_id: data.parent_id === "null" ? null : Number(data.parent_id),
    };

    try {
      await api.put("/menu", payload);

      // Refresh menu list after add
      const res = await api.get("/menu-list");
      const rawData = res.data.data || [];
      const normalized = normalizeTree(rawData);
      setMenus(normalized);

      setMessage("Menu item added successfully!");
      setSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting menu:", error);
      setMessage("Error adding menu.");
      setSuccess(false);
    }
  };

  if (loadingMenus) return <p>Loading menus...</p>;



  // Recursive function to render menu rows with better spacing and icon button
  const renderMenuRows = (items, level = 0) => {
    return items.flatMap((item, index) => {
      const submenuBadge =
        level > 0 ? (
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              lineHeight: "20px",
              textAlign: "center",
              marginRight: 8,
              borderRadius: 3,
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontSize: 12,
              userSelect: "none",
            }}
          >
            {index + 1}
          </span>
        ) : null;

      return [
        <tr
          key={item.id}
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            fontSize: 14,
            color: "#111827",
          }}
        >
          <td
            style={{
              paddingLeft: level === 0 ? 36 : 36 + level * 28,
              verticalAlign: "middle",
              fontWeight: level === 0 ? "600" : "400",
              whiteSpace: "nowrap",
            }}
          >
            {submenuBadge}
            {item.title}
          </td>
          <td
            style={{
              padding: "12px",
              whiteSpace: "nowrap",
              color: "#4b5563",
            }}
          >
            {item.url}
          </td>
          <td
            style={{
              textAlign: "right",
              paddingRight: 36,
              verticalAlign: "middle",
            }}
          >
            <button
              onClick={() => handleDelete(item.id)}
              title="Delete menu"
              aria-label={`Delete ${item.title}`}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 4,
                color: "#ef4444",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ef4444")}
            >
              <FiTrash2 size={15} />
            </button>
          </td>
        </tr>,
        ...(item.children && item.children.length > 0
          ? renderMenuRows(item.children, level + 1)
          : []),
      ];
    });
  };

  return (
    <div>
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
          <h6 className="text-white text-capitalize ps-3">Menu</h6>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans "
      >
        <div className="mb-3">
          <label
            htmlFor="title"
            className="block mb-1 font-medium text-gray-700"
          >
            Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="block mb-1 font-medium text-gray-700">
            Url
          </label>
          <input
            {...register("url", { required: "URL required" })}
            placeholder="URL"
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="parent_menu"
            className="block mb-1 font-medium text-gray-700"
          >
            Parent Menu
          </label>
          <select
            {...register("parent_id")}
            className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.parent_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="null">None (top-level menu)</option>
            {menus.map((item) => {
              const renderOption = (item, level = 0) => (
                <React.Fragment key={item.id}>
                  <option value={item.id}>
                    {`${"— ".repeat(level)}${item.title}`}
                  </option>
                  {item.children &&
                    item.children.map((child) => renderOption(child, level + 1))}
                </React.Fragment>
              );
              return renderOption(item);
            })}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`p-head w-btn py-2 text-white font-semibold rounded-lg transition ${
            isSubmitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Add Menu"}
        </button>
      </form>

      {message && (
          <p
            style={{
              marginTop: 10,
              color: success ? "green" : "red",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
      )}

      

      <div className="menu-list-container mt-6">
        <h6 className="text-white text-capitalize ps-3 bg-gradient-dark shadow-dark border-radius-lg py-2">Menu List</h6>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
            borderRadius: 20,
          }}
        >
          <thead
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
              fontWeight: "600",
              color: "#6b7280",
              textAlign: "left",
            }}
          >
            <tr>
              <th style={{ padding: "12px 16px" }}>Menu Title</th>
              <th style={{ padding: "12px 16px", width: "40%" }}>Link URL</th>
              <th style={{ padding: "12px 16px", width: 80, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{renderMenuRows(menus)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuForm;
