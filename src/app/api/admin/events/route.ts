export const dynamic = "force-dynamic";

import { prisma, makeListRoute } from "@/lib/crud";

export const { GET, POST } = makeListRoute(prisma.eventItem);
