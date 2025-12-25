"use client";

import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { Send, User, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
}

function MessagesContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Current User
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) setLoading(false);
    };
    getUser();
  }, [supabase]);

  // 2. Fetch Target User Profile
  useEffect(() => {
    const getTargetUser = async () => {
      if (!targetUserId) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", targetUserId)
        .single();
      
      if (data) setTargetUser(data);
    };
    getTargetUser();
  }, [targetUserId, supabase]);

  // 3. Fetch Messages & Subscribe
  useEffect(() => {
    if (!currentUser || !targetUserId) {
        if (currentUser && !targetUserId) setLoading(false);
        return;
    }

    setLoading(true);

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUser.id}`, // Listen for incoming
        },
        (payload) => {
            if (payload.new.sender_id === targetUserId) {
                setMessages((prev) => [...prev, payload.new as Message]);
            }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, targetUserId, supabase]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !targetUserId) return;

    const tempMsg = newMessage;
    setNewMessage(""); // Optimistic clear

    // Optimistic Update
    const optimisticMsg: Message = {
        id: crypto.randomUUID(),
        sender_id: currentUser.id,
        receiver_id: targetUserId,
        content: tempMsg,
        created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: targetUserId,
      content: tempMsg,
    });

    if (error) {
      console.error("Error sending message:", error);
      // Rollback (simplified, typically you'd flag it as failed)
      alert("Failed to send message");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Please Login to Chat</h2>
            <Link href="/login" className="px-6 py-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">Login</Link>
        </div>
      </div>
    );
  }

  if (!targetUserId) {
      return (
          <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
              <div className="text-center bg-slate-900 border border-slate-800 p-12 rounded-2xl max-w-lg">
                  <MessageSquare className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">No Conversation Selected</h2>
                  <p className="text-slate-400 mb-8">
                      Please select an engineer or client from the dashboard to start messaging.
                  </p>
                  <Link href="/engineers" className="text-blue-400 hover:text-blue-300">
                      Browse Engineers &rarr;
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950">
      {/* Chat Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center shadow-md z-10">
        <Link href="/engineers" className="text-slate-400 mr-4 hover:text-white md:hidden">
            &larr; Back
        </Link>
        {targetUser ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden mr-3">
               {targetUser.avatar_url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={targetUser.avatar_url} alt={targetUser.full_name} className="w-full h-full object-cover" />
               ) : (
                   <User className="w-full h-full p-2 text-slate-400" />
               )}
            </div>
            <div>
              <h2 className="text-white font-semibold">{targetUser.full_name}</h2>
              <span className="text-xs text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Online
              </span>
            </div>
          </div>
        ) : (
            <div className="flex items-center animate-pulse">
                <div className="w-10 h-10 bg-slate-800 rounded-full mr-3"></div>
                <div className="h-4 w-32 bg-slate-800 rounded"></div>
            </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-950 scroll-smooth"
      >
        {loading ? (
             <div className="flex justify-center items-center h-full">
                 <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
             </div>
        ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                <p>No messages yet. Say hello!</p>
            </div>
        ) : (
            messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
                <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                <div
                    className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                    isMe
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                    }`}
                >
                    <p>{msg.content}</p>
                    <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                </div>
            );
            })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading chat...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
