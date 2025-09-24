import React from "react";
import { useParams } from "react-router-dom";
import CustomPostForm from "../../components/admin/CustomPostBuilder/CustomPostForm";

export default function CustomPostFormPage() {
  const { tableName } = useParams();

  if (!tableName) {
    return <p className="p-4 text-red-600">Error: Table name is missing from the URL.</p>;
  }

  return (
    <div>
      <CustomPostForm tableName={tableName} />
    </div>
  );
}