import React from "react";
import { useParams } from "react-router-dom";
import CustomPostList from "../../components/admin/CustomPostBuilder/CustomPostList";

export default function CustomPostListPage() {
    const { tableName } = useParams();
  return (
    <div>
      <CustomPostList tableName={tableName}/>
    </div>
  );
}
