import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// Middleware helper to authenticate and return payload
async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const taskRecords = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

    if (taskRecords.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = taskRecords[0];

    // Check authorization: only admin or the creator can view
    if (user.role !== "admin" && task.createdBy !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Fetch task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Verify existence and authorization
    const taskRecords = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

    if (taskRecords.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const existingTask = taskRecords[0];

    if (user.role !== "admin" && existingTask.createdBy !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = { ...result.data, updatedAt: new Date() };

    const updatedTaskResult = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json({ message: "Task updated successfully", task: updatedTaskResult[0] }, { status: 200 });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // Verify existence and authorization
    const taskRecords = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

    if (taskRecords.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const existingTask = taskRecords[0];

    if (user.role !== "admin" && existingTask.createdBy !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
