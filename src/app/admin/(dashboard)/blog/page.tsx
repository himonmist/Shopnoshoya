"use client";

import EntityManager from "@/components/admin/EntityManager";

export default function AdminBlogPage() {
  return (
    <EntityManager
      title="ব্লগ পরিচালনা"
      apiBase="/api/admin/blog"
      columns={["শিরোনাম", "লেখক", "ট্যাগ", "ছবি", "প্রকাশিত?"]}
      emptyItem={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        tag: "",
        authorName: "",
        published: true,
      }}
      fields={[
        { key: "title", label: "শিরোনাম" },
        { key: "slug", label: "স্লাগ (URL, খালি রাখলে স্বয়ংক্রিয়)" },
        { key: "excerpt", label: "সংক্ষিপ্ত বিবরণ", type: "textarea" },
        { key: "content", label: "পূর্ণ লেখা (অনুচ্ছেদের মাঝে ফাঁকা লাইন দিন)", type: "textarea", rows: 10 },
        { key: "imageUrl", label: "কভার ছবি", type: "image" },
        { key: "tag", label: "ট্যাগ" },
        { key: "authorName", label: "লেখক" },
        { key: "published", label: "প্রকাশিত?", type: "checkbox" },
      ]}
    />
  );
}
