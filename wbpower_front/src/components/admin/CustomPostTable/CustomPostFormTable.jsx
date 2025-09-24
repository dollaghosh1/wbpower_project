import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

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
    <div>
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 top-7">
              <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">Create Dynamic Table</h6>
              </div>
            </div>
        
      <form onSubmit={handleSubmit} className="mx-auto p-frm bg-white rounded-2xl shadow-lg font-sans ">
        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Category</label>
          <select
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full border px-3 py-2"
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
          <label className="block font-medium mb-2">Fields</label>
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex gap-3 mb-3 items-center border p-3"
            >
              <input
                type="text"
                placeholder="Field name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                className="flex-1 border px-3 py-2"
                required
              />
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                className="border px-3 py-2"
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
                <FiTrash2 size={15} />
              </button>

            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="px-4 py-2 bg-green-600 text-white"
          >
            + Add Field
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="p-head w-btn py-2 text-white font-semibold rounded-lg transition mt-5 w-full py-2"
        >
          Create Table
        </button>
        {message && (
         <p className="mt-1 text-sm text-green-600">{message}</p>
  
      )}
        
      </form>

    </div>
  );
}
