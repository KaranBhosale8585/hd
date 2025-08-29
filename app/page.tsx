"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Trash2, X } from "lucide-react";
import Header from "@/components/Header";

// ✅ Define types
type User = {
  name: string;
  email: string;
};

type Note = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data.user || null);
        setNotes(data.notes || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const createNote = async () => {
    if (!newTitle.trim()) return toast.error("Title is required");
    if (!newDescription.trim()) return toast.error("Description is required");

    try {
      const res = await fetch("/api/notes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ fixed
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create note");

      setNotes((prev) => [...prev, data]);
      setNewTitle("");
      setNewDescription("");
      setIsModalOpen(false);
      toast.success("Note created");
    } catch (error: any) {
      toast.error(error.message || "Failed to create note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch("/api/notes/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }, // ✅ fixed
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete note");

      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-sm mt-10 animate-pulse">
        Loading <span className="animate-spin inline-block">⏳</span>
      </p>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <p className="text-center text-red-600 font-medium mt-10">
          Unauthorized access
        </p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-10 text-black">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* User Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Welcome, {user.name} 👋</h2>
            <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
          </div>

          {/* Create Note Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-14 sm:w-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Create Note
            </button>
          </div>

          {/* Notes Grid */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Your Notes</h3>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    onClick={() => setSelectedNote(note)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-100 rounded-xl p-4 flex flex-col justify-between shadow border cursor-pointer hover:bg-gray-200 transition overflow-hidden max-h-52"
                  >
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-md font-semibold truncate">
                        {note.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3 overflow-hidden">
                        {note.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note._id);
                        }}
                        aria-label="Delete note"
                      >
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-lg relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl text-black font-semibold">
                Create a New Note
              </h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <button
                onClick={createNote}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Create Note
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Description Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl relative"
            >
              <button
                onClick={() => setSelectedNote(null)}
                aria-label="Close modal"
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold">{selectedNote.title}</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedNote.description}
              </p>
              <p className="text-xs text-gray-500">
                Created At: {new Date(selectedNote.createdAt).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
