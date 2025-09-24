import React, { useState, useEffect } from "react";
import api from "../../../api/api";

export default function CustomPostFormTable() {
  const [categories, setCategories] = useState([]);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState([{ name: "", type: "string" }]);
  const [message, setMessage] = useState("");

  // Load categories on mount
  useEffect(() => {
    api.get("/allpostcategory")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tableName) {
      setMessage("Please select a category.");
      return;
    }

    const formattedFields = {};
    fields.forEach((f) => {
      if (f.name && f.type) {
        formattedFields[f.name] = f.type;
      }
    });

    if (Object.keys(formattedFields).length === 0) {
      setMessage("Add at least one field.");
      return;
    }

    try {
      const res = await api.post(
        "/postformtable-fields", // Ensure your Laravel route matches this
        {
          table_name: tableName,
          fields: formattedFields,
        }
      );

      setMessage(res.data.success || "Table created!");
      setFields([{ name: "", type: "string" }]); // reset fields
      setTableName("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Create Dynamic Table</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Category</label>
          <select
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.category_slug || cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Fields */}
        <div>
          <h3 className="font-medium mb-2">Fields</h3>
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex gap-3 mb-3 items-center border p-3 rounded"
            >
              <input
                type="text"
                placeholder="Field name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                required
              />
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="ckeditor">CKEditor</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="file">File</option>
              </select>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            + Add Field
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Table
        </button>
      </form>
    </div>
  );
}
