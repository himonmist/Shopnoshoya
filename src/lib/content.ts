import { prisma } from "./prisma";

export const defaultSettings = {
  id: 1,
  orgName: "স্বপ্নছোঁয়া",
  orgTagline: "স্বপ্ননগর, মিরপুর-৯, ঢাকা",
  heroTitleLine1: "সকালের",
  heroTitleLine2: "ব্যায়াম,",
  heroTitleLine3: "সারাজীবনের বন্ধন",
  heroDescription:
    "স্বপ্ননগরের সর্বপ্রথম এবং ঐতিহ্যবাহী একটি সংগঠন — ব্যায়ামের পাশাপাশি পারস্পরিক পরিচয়, সৌহার্দ্য ও সম্প্রীতির বন্ধনে আবদ্ধ একটি পরিবার।",
  heroImage1: "/gallery/g30.jpg",
  heroImage2: "/gallery/g08.jpg",
  heroImage3: "/gallery/g16.jpg",
  announcementText: "স্বপ্নছোঁয়া'র ৪র্থ প্রতিষ্ঠা বার্ষিকী — ১৮ সেপ্টেম্বর, শুক্রবার",
  aboutText:
    "স্বপ্নছোঁয়া স্বপ্ননগরের সর্বপ্রথম এবং ঐতিহ্যবাহী একটি সংগঠন। এই সংগঠনের মাধ্যমেই আমরা স্বপ্ননগরবাসী ব্যায়ামের পাশাপাশি পারস্পরিক পরিচয় এবং সৌহার্দ্য ও সম্প্রীতির বন্ধনে আবদ্ধ হয়েছিলাম এবং ঐক্যবদ্ধ হয়েছিলাম স্বপ্ননগরের উন্নয়নে।",
  aboutImage: "/gallery/g24.jpg",
  committeeNote:
    "বর্তমান কার্যনির্বাহী কমিটির সভাপতি, সাধারণ সম্পাদক ও সদস্যদের নাম ও ছবি শীঘ্রই এখানে যুক্ত করা হবে।",
  stat1Value: "০৪", stat1Label: "বছরের পথচলা",
  stat2Value: "১০০+", stat2Label: "সক্রিয় সদস্য",
  stat3Value: "৭", stat3Label: "দিন, প্রতি সকাল",
  stat4Value: "১", stat4Label: "অভিন্ন পরিবার",
  contactAddress: "স্বপ্নছোঁয়া, স্বপ্ননগর\nআ/এ-১, মিরপুর-৯\nঢাকা-১২১৬, বাংলাদেশ",
  contactNote: "ফোন ও ইমেইল ঠিকানা শীঘ্রই এখানে যুক্ত করা হবে।",
  contactPhone: "",
  contactEmail: "",
  exerciseTimeNote: "প্রতিদিন সকাল, স্বপ্ননগর খোলা মাঠ",
  footerTagline: "স্বপ্ননগরের সর্বপ্রথম ও ঐতিহ্যবাহী ব্যায়াম সংগঠন।",
};

export type Settings = typeof defaultSettings;

export async function getSettings(): Promise<Settings> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return s ? { ...defaultSettings, ...s } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function getActivities() {
  try {
    return await prisma.activity.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function getEvents() {
  try {
    return await prisma.eventItem.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function getGallery() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function getTips(page: string) {
  try {
    return await prisma.tip.findMany({ where: { page }, orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}
