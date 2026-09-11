import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@shopnoshoya.org";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "প্রশাসক", email: adminEmail, passwordHash },
  });

  const activityCount = await prisma.activity.count();
  if (activityCount === 0) {
    await prisma.activity.createMany({
      data: [
        { category: "কার্যক্রম", title: "প্রতিদিনের ব্যায়াম", description: "সকালের ব্যায়াম, বৃক্ষরোপণ ও স্বাস্থ্যসেবা শিবির।", imageUrl: "/gallery/g06.jpg", order: 1 },
        { category: "ফিটনেস টিপস", title: "সঠিক নিয়মে ব্যায়াম", description: "বয়স ও শরীরের ধরন অনুযায়ী পরামর্শ।", imageUrl: "/gallery/g27.jpg", order: 2 },
        { category: "জীবনযাপন", title: "স্বাস্থ্যকর অভ্যাস", description: "খাদ্যাভ্যাস, ঘুম ও মানসিক প্রশান্তি।", imageUrl: "/gallery/g31.jpg", order: 3 },
        { category: "গ্যালারি", title: "মুহূর্তের অ্যালবাম", description: "চার বছরের যাত্রার ছবি।", imageUrl: "/gallery/g10.jpg", order: 4 },
        { category: "সবুজায়ন", title: "বৃক্ষরোপণ ও পুষ্প বাগান পরিচর্যা", description: "সড়ক দ্বীপ ও খোলা জায়গায় গাছ ও ফুলের চারা রোপণ করে স্বপ্ননগরকে সবুজ রাখার চেষ্টা।", imageUrl: "/gallery/g07.jpg", order: 5 },
        { category: "স্বাস্থ্যসেবা", title: "টিকাদান ও স্বাস্থ্যসেবা শিবির", description: "স্থানীয় হাসপাতালের সহযোগিতায় মহিলা ও শিশুদের টিকাদান কর্মসূচিতে সহায়তা।", imageUrl: "/gallery/g28.jpg", order: 6 },
        { category: "পরিচ্ছন্নতা", title: "পরিচ্ছন্নতা ও মশক নিধন অভিযান", description: "\"ছদ্মবেশে স্বপ্ননগর\" স্লোগানে এলাকা পরিষ্কার ও মশক নিধনের উদ্যোগ।", imageUrl: "/gallery/g21.jpg", order: 7 },
        { category: "সম্প্রীতি", title: "বনভোজন ও পারিবারিক মিলনমেলা", description: "প্রতি বছর সদস্য ও পরিবারদের জন্য আয়োজিত বনভোজন — গান, খাবার আর আড্ডা।", imageUrl: "/gallery/g13.jpg", order: 8 },
        { category: "আড্ডা", title: "মৌসুমি ফল উৎসব ও একসাথে আহার", description: "কাঁঠাল, আম বা মৌসুমি ফল দিয়ে সদস্যদের একত্রে আড্ডা ও আহারের আয়োজন।", imageUrl: "/gallery/g23.jpg", order: 9 },
      ],
    });
  }

  const eventCount = await prisma.eventItem.count();
  if (eventCount === 0) {
    await prisma.eventItem.createMany({
      data: [
        { title: "স্বপ্নছোঁয়া'র ৪র্থ প্রতিষ্ঠা বার্ষিকী", description: "আগামী ১৮ই সেপ্টেম্বর, শুক্রবার আমরা উদযাপন করছি স্বপ্নছোঁয়ার ৪র্থ প্রতিষ্ঠা বার্ষিকী। সকল সদস্য ও পরিবারকে এই আনন্দ আয়োজনে সঙ্গী হওয়ার আমন্ত্রণ।", dateLabel: "১৮ সেপ্টেম্বর, শুক্রবার", imageUrl: "/gallery/g18.jpg", isUpcoming: true, order: 1 },
        { title: "বনভোজন-২০২৪, জিন্দা পার্ক", description: "সদস্য ও পরিবার নিয়ে দিনব্যাপী আনন্দ আয়োজন — গান, খাবার আর উপহার বিতরণ।", dateLabel: "ফেব্রুয়ারি ২০২৪", imageUrl: "/gallery/g14.jpg", isUpcoming: false, order: 2 },
        { title: "ভ্যাকসিনেশন ক্যাম্প", description: "কিংস্টন হাসপাতালের সহায়তায় মহিলা ও শিশুদের টিকাদান কর্মসূচি।", dateLabel: "শীতকাল", imageUrl: "/gallery/g26.jpg", isUpcoming: false, order: 3 },
        { title: "বৃক্ষরোপণ ও ফুলবাগান কর্মসূচি", description: "সড়ক দ্বীপে গাছ ও ফুলের চারা রোপণ করেন সদস্যরা।", dateLabel: "শীতকাল", imageUrl: "/gallery/g07.jpg", isUpcoming: false, order: 4 },
        { title: "স্বপ্নছোঁয়ার ১ম বর্ষপূর্তি", description: "প্রথম বছর পূর্তিতে কেক কেটে ও দোয়া মাহফিলে উদযাপন করা হয়।", dateLabel: "মে ২০২২", imageUrl: "/gallery/g20.jpg", isUpcoming: false, order: 5 },
      ],
    });
  }

  const tipsCount = await prisma.tip.count();
  if (tipsCount === 0) {
    await prisma.tip.createMany({
      data: [
        { page: "fitness-tips", badge: "০১", title: "শুরুতে অবশ্যই ওয়ার্ম-আপ করুন", description: "শরীর ঠান্ডা অবস্থায় হঠাৎ ভারী ব্যায়ামে না গিয়ে, প্রথমে ৫-৭ মিনিট হালকা হাঁটা ও স্ট্রেচিং করে শরীরকে প্রস্তুত করুন।", order: 1 },
        { page: "fitness-tips", badge: "০২", title: "নিজের সামর্থ্য বুঝে গতি নির্ধারণ করুন", description: "অন্যের সাথে তুলনা না করে, নিজের শ্বাস-প্রশ্বাস ও ক্লান্তি বুঝে ব্যায়ামের গতি ঠিক করুন।", order: 2 },
        { page: "fitness-tips", badge: "০৩", title: "খালি পেটে নয়, হালকা পেটে ব্যায়াম করুন", description: "ঘুম থেকে উঠে এক গ্লাস পানি পান করে হালকা শরীরে ব্যায়াম শুরু করুন।", order: 3 },
        { page: "fitness-tips", badge: "০৪", title: "সঠিক জুতা ও পোশাক পরুন", description: "আরামদায়ক জুতা এবং ঢিলেঢালা সুতির পোশাক চোট এড়াতে সাহায্য করে।", order: 4 },
        { page: "fitness-tips", badge: "০৫", title: "ব্যায়ামের পর কুল-ডাউন করুন", description: "আচমকা না থেমে ২-৩ মিনিট ধীরে হাঁটুন ও স্ট্রেচিং করে হৃদস্পন্দন স্বাভাবিক করুন।", order: 5 },
        { page: "fitness-tips", badge: "০৬", title: "শরীরের সংকেত উপেক্ষা করবেন না", description: "বুকে চাপ বা মাথা ঘোরা হলে সাথে সাথে ব্যায়াম থামিয়ে বিশ্রাম নিন।", order: 6 },
        { page: "healthy-lifestyle", badge: "খাদ্যাভ্যাস", title: "সুষম ও মৌসুমি খাবার", description: "শাকসবজি, ফল ও মৌসুমি খাদ্য বেশি রাখুন, অতিরিক্ত তেল-চিনি এড়িয়ে চলুন।", order: 1 },
        { page: "healthy-lifestyle", badge: "পানি", title: "পর্যাপ্ত পানি পান করুন", description: "সকালে ও দিনভর নিয়মিত বিরতিতে পানি পান শরীরের কার্যক্ষমতা ধরে রাখে।", order: 2 },
        { page: "healthy-lifestyle", badge: "ঘুম", title: "নিয়মিত ও পর্যাপ্ত ঘুম", description: "প্রতিদিন একই সময়ে ঘুম ও ৭-৮ ঘণ্টা বিশ্রাম শরীর-মনের জন্য অপরিহার্য।", order: 3 },
        { page: "healthy-lifestyle", badge: "মানসিক প্রশান্তি", title: "সামাজিক সম্পর্ক ও অবসর", description: "প্রতিবেশী ও বন্ধুদের সাথে আড্ডা মানসিক চাপ কমায় — স্বপ্নছোঁয়ার মূল চেতনা।", order: 4 },
        { page: "healthy-lifestyle", badge: "নিয়মিততা", title: "প্রতিদিনের ছোট অভ্যাস", description: "লিফটের বদলে সিঁড়ি, কাছের দূরত্বে হাঁটা — ছোট পরিবর্তনের বড় প্রভাব।", order: 5 },
        { page: "healthy-lifestyle", badge: "স্বাস্থ্য পরীক্ষা", title: "নিয়মিত স্বাস্থ্য পরীক্ষা করান", description: "বছরে অন্তত একবার রক্তচাপ ও ডায়াবেটিস পরীক্ষা করিয়ে নিন।", order: 6 },
      ],
    });
  }

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    const nums = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
    await prisma.galleryImage.createMany({
      data: nums.map((n, i) => ({ url: `/gallery/g${n}.jpg`, alt: "স্বপ্নছোঁয়া", order: i + 1 })),
    });
  }

  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          slug: "keno-protidin-sokale-bayam",
          title: "কেন প্রতিদিন সকালে ব্যায়াম করা উচিত",
          excerpt: "সকালের নির্মল বাতাসে ব্যায়াম শুধু শরীর ভালো রাখে না, দিনের শুরুতেই মনকে করে চনমনে। স্বপ্নছোঁয়ার সদস্যরা কেন প্রতিদিন ভোরে মাঠে হাজির হন — তার পেছনের গল্প।",
          content: "সকালের নির্মল বাতাসে ব্যায়াম শুধু শরীর ভালো রাখে না, দিনের শুরুতেই মনকে করে চনমনে। স্বপ্নছোঁয়ার সদস্যরা কেন প্রতিদিন ভোরে মাঠে হাজির হন — তার পেছনের গল্প।\n\nপ্রতিদিন ভোরে একসাথে হাঁটাহাঁটি ও ব্যায়াম শুধু শারীরিক সুস্থতা নয়, মানসিক প্রশান্তি ও সামাজিক বন্ধনও তৈরি করে। এটাই স্বপ্নছোঁয়ার মূল চেতনা।",
          imageUrl: "/gallery/g25.jpg",
          tag: "অভ্যাস",
          publishedAt: new Date("2026-09-10"),
        },
        {
          slug: "sobuj-shopnonogor-gorar-prochesta",
          title: "সবুজ স্বপ্ননগর গড়ার প্রচেষ্টা",
          excerpt: "শুধু ব্যায়াম নয়, নিজের এলাকাকে সবুজ ও পরিষ্কার রাখার দায়িত্বও নিয়েছেন স্বপ্নছোঁয়ার সদস্যরা। বৃক্ষরোপণ ও পরিচ্ছন্নতা অভিযানের অভিজ্ঞতা নিয়ে এই লেখা।",
          content: "শুধু ব্যায়াম নয়, নিজের এলাকাকে সবুজ ও পরিষ্কার রাখার দায়িত্বও নিয়েছেন স্বপ্নছোঁয়ার সদস্যরা। বৃক্ষরোপণ ও পরিচ্ছন্নতা অভিযানের অভিজ্ঞতা নিয়ে এই লেখা।\n\nসড়ক দ্বীপ ও খোলা জায়গায় নিয়মিত গাছ ও ফুলের চারা রোপণ করে আমরা স্বপ্ননগরকে আরও সবুজ রাখার চেষ্টা করছি।",
          imageUrl: "/gallery/g07.jpg",
          tag: "পরিবেশ",
          publishedAt: new Date("2026-09-02"),
        },
        {
          slug: "char-bochore-shopnochhoya",
          title: "চার বছরে স্বপ্নছোঁয়া: একটি সংগঠনের গল্প",
          excerpt: "একদল প্রতিবেশীর সকালের হাঁটাহাঁটি থেকে কীভাবে গড়ে উঠল স্বপ্ননগরের সবচেয়ে ঐতিহ্যবাহী সংগঠন — ৪র্থ বার্ষিকীর প্রাক্কালে ফিরে দেখা।",
          content: "একদল প্রতিবেশীর সকালের হাঁটাহাঁটি থেকে কীভাবে গড়ে উঠল স্বপ্ননগরের সবচেয়ে ঐতিহ্যবাহী সংগঠন — ৪র্থ বার্ষিকীর প্রাক্কালে ফিরে দেখা।\n\nচার বছর আগে কয়েকজন প্রতিবেশীর সকালের হাঁটাহাঁটি থেকে শুরু, আজ শতাধিক সদস্যের একটি পরিবার — এই যাত্রা আমাদের সবার গর্বের।",
          imageUrl: "/gallery/g20.jpg",
          tag: "ইতিহাস",
          publishedAt: new Date("2026-08-25"),
        },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
