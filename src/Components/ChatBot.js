import React, { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

const quickReplies = [
  "How do I start a fundraiser?",
  "How can I donate?",
  "Where can I track campaigns?",
];

const getBotReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes("start") || text.includes("fundraiser")) {
    return "To start a fundraiser, sign in, open Fund Categories, choose a category, and fill out the fundraiser form with your goal, story, beneficiary, and cover image.";
  }

  if (text.includes("donate") || text.includes("payment")) {
    return "To donate, open Campaigns, choose a cause, select a recipient if available, and continue to the donation page.";
  }

  if (text.includes("track") || text.includes("dashboard") || text.includes("campaign")) {
    return "You can track created fundraisers in your dashboard. Admins can review campaigns, donors, donations, approvals, reports, and messages from the admin dashboard.";
  }

  return "I can help with starting fundraisers, donations, campaign tracking, approvals, and dashboard navigation.";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am your fundraising assistant. Ask me about donations, campaigns, or dashboard help.",
    },
  ]);

  const sendMessage = (text = draft) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { from: "user", text: trimmed },
      { from: "bot", text: getBotReply(trimmed) },
    ]);
    setDraft("");
    setOpen(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:mb-4 sm:w-[360px]">
          <div className="flex items-center justify-between bg-teal-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-800 shadow-sm">
                <Bot size={22} />
              </span>
              <div>
                <p className="text-sm font-bold">Fundraising Assistant</p>
                <p className="text-xs text-teal-100">Online support</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  message.from === "user"
                    ? "ml-auto bg-teal-700 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                >
                  {reply}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Type your question..."
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800"
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white shadow-2xl ring-4 ring-teal-100 transition hover:-translate-y-1 hover:bg-teal-800 sm:h-16 sm:w-16"
        aria-label="Open chatbot"
      >
        {open ? <MessageCircle size={26} /> : <Bot className="transition group-hover:scale-110" size={30} />}
      </button>
    </div>
  );
};

export default ChatBot;
