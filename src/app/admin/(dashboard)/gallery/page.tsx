"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminGalleryPage() {
  return (
    <EntityManager
      title="গ্যালারি পরিচালনা"
      apiBase="/api/admin/gallery"
      columns={["ছবি", "বিবরণ", "ক্রম"]}
      emptyItem={{ url: "", alt: "", order: 0 }}
      fields={[
        { key: "url", label: "ছবি", type: "image" },
        { key: "alt", label: "বিবরণ" },
        { key: "order", label: "ক্রম", type: "number" },
      ]}
    />
  );
}
