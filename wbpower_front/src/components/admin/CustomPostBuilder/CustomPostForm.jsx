import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/**
 * @param {string} tableName - Dynamic table name
 * @param {string} mode - 'create' or 'edit'
 * @param {number} [id] - Used in edit mode
 */
export default function CustomPostForm({ tableName, mode = "create", id = null }) {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fields and post data if editing
  useEffect(() => {
    if (!tableName) {
      setError("No table name specified.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fieldRes = await api.get(`/custom-post-form-fields/${tableName}`);
        const fields = fieldRes.data?.fields || [];
        setFormFields(fields);

        const initialData = {};
        fields.forEach((f) => {
          initialData[f.name] = "";
        });

        // If editing, fetch the existing post data
        if (mode === "edit" && id) {
          const postRes = await api.get(`/custom-post/details/${tableName}/${id}`);
          console.log(postRes.data);
          const postData = postRes.data?.data || {};

          for (const field of fields) {
            const key = field.name;
            if (postData[key] !== undefined) {
              initialData[key] = postData[key];
            }
          }
        }

        setFormData(initialData);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, mode, id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCKEditorChange = (name, data) => {
    setFormData((prev) => ({ ...prev, [name]: data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      let endpoint = "";
      if (mode === "create") {
        endpoint = `/custom-post/create/${tableName}`;
      } else if (mode === "edit" && id) {
        endpoint = `/custom-post/update/${tableName}/${id}`;
      }

      const response = await api.post(endpoint, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        navigate(`/custom-post-list/${tableName}`);
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div>
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
        <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
          <h6 className="text-white text-capitalize ps-3">
            {mode === "edit" ? "Edit" : "Create"} Custom Post: {tableName}
          </h6>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans">
        {formFields.map((field, index) => (
          <div key={index} className="flex flex-col mb-4">
            <label htmlFor={field.name} className="block mb-1 font-medium text-gray-700">
              {field.label || field.name}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="w-full px-2 py-2 border rounded-lg"
                placeholder={field.placeholder || field.label}
                required={field.required || false}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md"
                placeholder={field.placeholder || field.label}
                required={field.required || false}
              />
            )}

            {field.type === "richtext" && (
              <div className="border rounded-md">
                <CKEditor
                  editor={ClassicEditor}
                  data={formData[field.name] || ""}
                  onChange={(event, editor) => {
                    handleCKEditorChange(field.name, editor.getData());
                  }}
                />
              </div>
            )}

            {field.type === "number" && (
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md"
                placeholder={field.placeholder || field.label}
                required={field.required || false}
              />
            )}

            {field.type === "select" && Array.isArray(field.options) && (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md"
                required={field.required || false}
              >
                <option value="" disabled>
                  {field.placeholder || `Select ${field.label}`}
                </option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "file" && (
              <input
                type="file"
                id={field.name}
                name={field.name}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md"
                required={mode === "create" && field.required}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className={`p-head w-btn py-2 text-white font-semibold rounded-lg transition ${
            submitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Submitting..." : mode === "edit" ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
