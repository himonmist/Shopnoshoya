"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminEventsPage() {
  return (
    <EntityManager
      title="ইভেন্ট পরিচালনা"
      apiBase="/api/admin/events"
      columns={["শিরোনাম", "তারিখ", "ছবি", "আসন্ন?", "ক্রম"]}
      emptyItem={{ title: "", description: "", dateLabel: "", imageUrl: "", isUpcoming: false, order: 0 }}
      fields={[
        { key: "title", label: "শিরোনাম" },
        { key: "description", label: "বর্ণনা", type: "textarea" },
        { key: "dateLabel", label: "তারিখ" },
        { key: "imageUrl", label: "ছবি", type: "image" },
        { key: "isUpcoming", label: "আসন্ন?", type: "checkbox" },
        { key: "order", label: "ক্রম", type: "number" },
      ]}
    />
  );
}
