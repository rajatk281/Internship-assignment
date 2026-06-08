import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
});

// Middleware helper to authenticate and return payload
async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userTasks;
    
    // Admin sees all tasks, regular user sees only their own
    if (user.role === "admin") {
      userTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
    } else {
      userTasks = await db.select().from(tasks).where(eq(tasks.createdBy, user.userId)).orderBy(tasks.createdAt);
    }

    return NextResponse.json({ tasks: userTasks }, { status: 200 });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description } = result.data;

    const newTaskResult = await db
      .insert(tasks)
      .values({
        title,
        description,
        createdBy: user.userId,
      })
      .returning();

    return NextResponse.json({ message: "Task created successfully", task: newTaskResult[0] }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
