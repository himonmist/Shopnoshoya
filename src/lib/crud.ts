import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

/** Builds standard list+create route handlers for a Prisma model. */
export function makeListRoute(delegate: Delegate, orderBy: any = { order: "asc" }) {
  return {
    GET: withJsonErrors(async () => {
      const items = await delegate.findMany({ orderBy });
      return NextResponse.json(items);
    }),
    POST: withJsonErrors(async (req: NextRequest) => {
      const body = await req.json().catch(() => null);
      if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      delete body.id;
      const item = await delegate.create({ data: body });
      return NextResponse.json(item);
    }),
  };
}

/** Builds standard update+delete route handlers for a Prisma model, keyed by [id]. */
export function makeItemRoute(delegate: Delegate) {
  return {
    PUT: withJsonErrors(async (req: NextRequest, { params }: { params: { id: string } }) => {
      const body = await req.json().catch(() => null);
      if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
      const item = await delegate.update({ where: { id: params.id }, data: body });
      return NextResponse.json(item);
    }),
    DELETE: withJsonErrors(async (_req: NextRequest, { params }: { params: { id: string } }) => {
      await delegate.delete({ where: { id: params.id } });
      return NextResponse.json({ ok: true });
    }),
  };
}

export { prisma };
