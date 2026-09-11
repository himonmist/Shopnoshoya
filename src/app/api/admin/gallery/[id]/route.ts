import { prisma, makeItemRoute } from "@/lib/crud";

export const { PUT, DELETE } = makeItemRoute(prisma.galleryImage);
