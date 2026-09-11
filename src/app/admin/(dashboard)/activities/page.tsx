"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminActivitiesPage() {
  return (
    <EntityManager
      title="কার্যক্রম পরিচালনা"
      apiBase="/api/admin/activities"
      columns={["ক্যাটাগরি", "শিরোনাম", "ছবি", "ক্রম"]}
      emptyItem={{ category: "", title: "", description: "", imageUrl: "", order: 0 }}
      fields={[
        { key: "category", label: "ক্যাটাগরি" },
        { key: "title", label: "শিরোনাম" },
        { key: "description", label: "বর্ণনা", type: "textarea" },
        { key: "imageUrl", label: "ছবি", type: "image" },
        { key: "order", label: "ক্রম", type: "number" },
      ]}
    />
  );
}
