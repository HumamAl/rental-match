"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Circle,
  ChevronRight,
  Send,
  Home,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  messages,
  leadsAndInquiries,
  rentalResumes,
  activeListings,
  propertyManagers,
} from "@/data/mock-data";
import type { LeadStatus } from "@/lib/types";

// Build enriched thread list from leads + messages
interface Thread {
  leadId: string;
  leadStatus: LeadStatus;
  tenantName: string;
  tenantId: string;
  pmName: string;
  pmId: string;
  listingAddress: string;
  listingId: string;
  lastMessage: string;
  lastMessageTime: string;
  lastSenderRole: "manager" | "tenant";
  unreadCount: number;
  totalMessages: number;
}

function buildThreads(): Thread[] {
  return leadsAndInquiries
    .map((lead) => {
      const leadMessages = messages
        .filter((m) => m.leadId === lead.id)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      if (leadMessages.length === 0) return null;

      const last = leadMessages[leadMessages.length - 1];
      const unread = leadMessages.filter(
        (m) => !m.read && m.senderRole === "tenant"
      ).length;

      const resume = rentalResumes.find((r) => r.id === lead.resumeId);
      const listing = activeListings.find((l) => l.id === lead.listingId);
      const pm = propertyManagers.find((p) => p.id === lead.managerId);

      return {
        leadId: lead.id,
        leadStatus: lead.status,
        tenantName: resume
          ? `${resume.firstName} ${resume.lastName}`
          : "Unknown",
        tenantId: lead.resumeId,
        pmName: pm?.contactName ?? "PM",
        pmId: lead.managerId,
        listingAddress: listing
          ? `${listing.address}, ${listing.city}`
          : "Unknown unit",
        listingId: lead.listingId,
        lastMessage: last.content,
        lastMessageTime: last.timestamp,
        lastSenderRole: last.senderRole,
        unreadCount: unread,
        totalMessages: leadMessages.length,
      } as Thread;
    })
    .filter(Boolean) as Thread[];
}

const allThreads = buildThreads();

function threadStatusBadge(status: LeadStatus) {
  const config: Record<
    LeadStatus,
    { label: string; color: "success" | "warning" | "muted" | "destructive" }
  > = {
    "New Match": { label: "New Match", color: "success" },
    "Inquiry Sent": { label: "Inquiry Sent", color: "warning" },
    "Showing Scheduled": { label: "Showing Scheduled", color: "warning" },
    "Application Received": { label: "Application Received", color: "success" },
    "Under Review": { label: "Under Review", color: "warning" },
    Approved: { label: "Approved", color: "success" },
    Declined: { label: "Declined", color: "destructive" },
    Withdrew: { label: "Withdrew", color: "muted" },
  };

  const c = config[status] ?? { label: status, color: "muted" };
  const colorClass = {
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    destructive: "text-destructive bg-destructive/10",
    muted: "text-muted-foreground bg-muted",
  }[c.color];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border-0 rounded-full", colorClass)}
    >
      {c.label}
    </Badge>
  );
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date("2026-02-26T12:00:00Z");
  const diffHours = (now.getTime() - date.getTime()) / 3600000;
  if (diffHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    allThreads[0]?.leadId ?? null
  );
  const [replyText, setReplyText] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);

  const filteredThreads = useMemo(() => {
    return allThreads
      .filter((t) => {
        const matchStatus =
          statusFilter === "all" ||
          (statusFilter === "unread" && t.unreadCount > 0) ||
          (statusFilter !== "unread" && t.leadStatus === statusFilter);
        const matchSearch =
          search === "" ||
          t.tenantName.toLowerCase().includes(search.toLowerCase()) ||
          t.listingAddress.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );
  }, [search, statusFilter]);

  const selectedThread = allThreads.find((t) => t.leadId === selectedLeadId);
  const threadMessages = useMemo(
    () =>
      localMessages
        .filter((m) => m.leadId === selectedLeadId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
    [localMessages, selectedLeadId]
  );

  function handleSendReply() {
    if (!replyText.trim() || !selectedLeadId) return;
    const newMsg = {
      id: `msg_reply_${Date.now()}`,
      leadId: selectedLeadId,
      senderId: "pm_xf9m2",
      senderRole: "manager" as const,
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setReplyText("");
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conversations between your team and prospective tenants
          </p>
        </div>
        {allThreads.some((t) => t.unreadCount > 0) && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--warning)] bg-[color:var(--warning)]/10 px-3 py-1.5 rounded-full">
            <Circle className="w-2 h-2 fill-current" />
            {allThreads.reduce((sum, t) => sum + t.unreadCount, 0)} unread{" "}
            {allThreads.reduce((sum, t) => sum + t.unreadCount, 0) === 1
              ? "message"
              : "messages"}
          </div>
        )}
      </div>

      {/* Split Panel */}
      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left: Thread List */}
        <Card className="w-80 shrink-0 shadow-md border border-border/40 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="p-3 border-b border-border/40 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All threads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Threads</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="Showing Scheduled">Showing Scheduled</SelectItem>
                <SelectItem value="Application Received">Application Received</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thread items */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No threads match this filter.
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <button
                  key={thread.leadId}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-border/30 hover:bg-[color:var(--surface-hover)] transition-colors duration-150 flex items-start gap-2.5",
                    selectedLeadId === thread.leadId &&
                      "bg-primary/5 border-l-2 border-l-primary"
                  )}
                  onClick={() => setSelectedLeadId(thread.leadId)}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {thread.tenantName[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={cn(
                          "text-sm truncate",
                          thread.unreadCount > 0
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground"
                        )}
                      >
                        {thread.tenantName}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatTime(thread.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {thread.listingAddress}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {thread.lastSenderRole === "manager" ? "You: " : ""}
                      {thread.lastMessage}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {threadStatusBadge(thread.leadStatus)}
                      {thread.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-1" />
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Right: Message thread */}
        {selectedThread ? (
          <Card className="flex-1 shadow-md border border-border/40 flex flex-col overflow-hidden min-w-0">
            {/* Thread header */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between gap-3 bg-muted/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {selectedThread.tenantName[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{selectedThread.tenantName}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Home className="w-3 h-3 shrink-0" />
                    {selectedThread.listingAddress}
                  </p>
                </div>
              </div>
              {threadStatusBadge(selectedThread.leadStatus)}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {threadMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No messages yet in this thread.
                  </p>
                </div>
              ) : (
                threadMessages.map((msg) => {
                  const isManager = msg.senderRole === "manager";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2.5 max-w-[85%]",
                        isManager ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                          isManager
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isManager ? (
                          <User className="w-3.5 h-3.5" />
                        ) : (
                          selectedThread.tenantName[0]
                        )}
                      </div>

                      <div>
                        <div
                          className={cn(
                            "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                            isManager
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm"
                          )}
                        >
                          {msg.content}
                        </div>
                        <p
                          className={cn(
                            "text-[10px] text-muted-foreground mt-1",
                            isManager ? "text-right" : "text-left"
                          )}
                        >
                          {isManager ? "You" : selectedThread.tenantName.split(" ")[0]}
                          {" · "}
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply input */}
            <div className="p-3 border-t border-border/40 bg-muted/10">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Reply to this tenant..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    className="resize-none"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">
                Press Enter to send · Replies are tracked in the compliance audit log
              </p>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 shadow-md border border-border/40 flex items-center justify-center text-center p-8">
            <div>
              <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Select a thread to view the conversation
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {allThreads.length} active threads across all inquiries
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
