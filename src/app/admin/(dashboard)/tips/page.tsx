"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminTipsPage() {
  return (
    <EntityManager
      title="টিপস পরিচালনা"
      apiBase="/api/admin/tips"
      columns={["পাতা", "ব্যাজ", "শিরোনাম", "ক্রম"]}
      emptyItem={{ page: "fitness-tips", badge: "", title: "", description: "", order: 0 }}
      fields={[
        {
          key: "page", label: "পাতা", type: "select",
          options: [
            { value: "fitness-tips", label: "ফিটনেস টিপস" },
            { value: "healthy-lifestyle", label: "স্বাস্থ্যকর জীবনযাপন" },
          ],
        },
        { key: "badge", label: "ব্যাজ / নম্বর" },
        { key: "title", label: "শিরোনাম" },
        { key: "description", label: "বর্ণনা", type: "textarea" },
        { key: "order", label: "ক্রম", type: "number" },
      ]}
    />
  );
}
