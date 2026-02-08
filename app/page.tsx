import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ Static optimization + revalidation
export const revalidate = 60; // 60 seconds cache

export default async function Home() {
  // ✅ Run both in parallel (faster)
  const [session, bulls] = await Promise.all([
    getServerSession(authOptions),

    prisma.bull.findMany({
      where: {
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        createdAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12, // 🔥 20 → 12 (homepage faster, UI same)
    }),
  ]);

  return <HomeClient session={session} initialBulls={bulls} />;
}
