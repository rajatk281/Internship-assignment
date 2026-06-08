"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [userRes, tasksRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/tasks")
      ]);

      if (userRes.status === 401) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const tasksData = await tasksRes.json();

      setUser(userData.user);
      setTasks(tasksData.tasks || []);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to log out");
    }
  }

  async function handleSaveTask(taskData: { title: string; description: string }) {
    try {
      if (editingTask) {
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        
        if (!res.ok) throw new Error("Failed to update task");
        
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === editingTask.id ? updated.task : t));
        toast.success("Task updated");
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        
        if (!res.ok) throw new Error("Failed to create task");
        
        const created = await res.json();
        setTasks([...tasks, created.task]);
        toast.success("Task created");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error("An error occurred while saving the task");
    }
  }

  async function handleDeleteTask(id: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  }

  async function handleToggleStatus(task: Task) {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      if (!res.ok) throw new Error("Failed to update task status");
      
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === task.id ? updated.task : t));
    } catch (error) {
      toast.error("Failed to update task status");
    }
  }

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user?.name} {user?.role === "admin" && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Admin</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={openCreateModal}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Tasks</div>
          <div className="text-3xl font-bold">{tasks.length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
          <div className="text-sm font-medium text-emerald-500 mb-1">Completed</div>
          <div className="text-3xl font-bold">{completedCount}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
          <div className="text-sm font-medium text-amber-500 mb-1">Pending</div>
          <div className="text-3xl font-bold">{tasks.length - completedCount}</div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center border-dashed">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No tasks yet</h3>
            <p className="text-slate-500 mb-6">Create your first task to get started</p>
            <button 
              onClick={openCreateModal}
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
            >
              + Create a new task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={openEditModal} 
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask} 
        task={editingTask} 
      />
    </div>
  );
}
