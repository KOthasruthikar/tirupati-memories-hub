import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  History, 
  Send, 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Filter,
  Eye,
  Sparkles,
  Crown,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useAccessRequestHistory, 
  useIncomingAccessRequests, 
  useResendAccessRequest 
} from "@/hooks/useAccessRequests";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LazyImage from "@/components/LazyImage";
import { toast } from "sonner";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";

const AccessHistory = () => {
  const { member: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: sentRequests, isLoading: sentLoading } = useAccessRequestHistory(currentUser?.uid || "");
  const { data: receivedRequests, isLoading: receivedLoading } = useIncomingAccessRequests(currentUser?.uid || "");
  const resendAccessRequest = useResendAccessRequest();

  const formatRequestDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isToday(date)) {
      return {
        day: "Today",
        time: format(date, "h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
      };
    } else if (isYesterday(date)) {
      return {
        day: "Yesterday",
        time: format(date, "h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
      };
    } else if (isThisWeek(date)) {
      return {
        day: format(date, "EEEE"),
        time: format(date, "h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
      };
    } else {
      return {
        day: format(date, "MMM d"),
        time: format(date, "h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")
      };
    }
  };

  const filterRequests = (requests: any[]) => {
    if (statusFilter === "all") return requests;
    return requests.filter((request: any) => request.status === statusFilter);
  };

  const handleResendRequest = async (request: any) => {
    try {
      await resendAccessRequest.mutateAsync({
        requesterUid: currentUser!.uid,
        ownerUid: request.owner_uid,
        requesterName: currentUser!.name,
      });
      toast.success(`New request sent to ${request.owner?.name}!`);
    } catch (error) {
      toast.error("Failed to resend request");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "denied":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "denied":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      case "pending":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
      default:
        return "bg-muted/30 border-border/50";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
            Please Login
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your access history
          </p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = sentLoading || receivedLoading;
  const currentRequests = activeTab === "sent" ? (sentRequests || []) : (receivedRequests || []);
  const filteredRequests = filterRequests(currentRequests);

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/members"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <History className="w-8 h-8 text-primary" />
            </motion.div>

            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Access <span className="text-gradient">History</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete history of your photo access requests - both sent and received
            </p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-border/50 mb-8 max-w-md mx-auto"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === "sent"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Send className="w-4 h-4" />
              Sent ({sentRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === "received"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Inbox className="w-4 h-4" />
              Received ({receivedRequests?.length || 0})
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-card/80 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredRequests.length} of {currentRequests.length} requests
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <p className="text-muted-foreground">Loading access history...</p>
              </div>
            </motion.div>
          ) : filteredRequests.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                {activeTab === "sent" ? (
                  <Send className="w-12 h-12 text-muted-foreground" />
                ) : (
                  <Inbox className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No {activeTab === "sent" ? "Sent" : "Received"} Requests
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "sent" 
                  ? "You haven't sent any access requests yet"
                  : "You haven't received any access requests yet"
                }
              </p>
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("all")}
                >
                  Clear Filter
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${statusFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredRequests.map((request: any, index: number) => {
                const dateInfo = formatRequestDate(request.updated_at);
                const otherUser = activeTab === "sent" ? request.owner : request.requester;
                
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${getStatusColor(request.status)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* User Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted ring-2 ring-background">
                            {otherUser?.profile_image ? (
                              <LazyImage
                                src={otherUser.profile_image}
                                alt={otherUser?.name || "User"}
                                className="w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-7 h-7 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          {/* Status indicator */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                            {getStatusIcon(request.status)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-heading text-lg font-semibold text-foreground">
                                {otherUser?.name || "Unknown User"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {activeTab === "sent" 
                                  ? "You requested access to their photos"
                                  : "They requested access to your photos"
                                }
                              </p>
                            </div>
                          </div>

                          {/* Date & Time Info */}
                          <div className="bg-background/50 rounded-lg p-3 mb-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground">{dateInfo.day}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{dateInfo.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{dateInfo.relative}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border/30">
                              <p className="text-xs text-muted-foreground">
                                Full timestamp: {dateInfo.full}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === "approved" 
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                : request.status === "denied"
                                ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                                : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                            }`}>
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {activeTab === "sent" && request.status === "denied" && (
                          <Button
                            onClick={() => handleResendRequest(request)}
                            disabled={resendAccessRequest.isPending}
                            size="sm"
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            {resendAccessRequest.isPending ? "Sending..." : "Resend"}
                          </Button>
                        )}
                        
                        {request.status === "approved" && (
                          <Link to={`/members/${activeTab === "sent" ? request.owner_uid : request.requester_uid}`}>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Profile
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        {!isLoading && currentRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-primary" />
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {activeTab === "sent" ? "Your Request" : "Incoming Request"} Summary
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {currentRequests.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {currentRequests.filter((r: any) => r.status === "approved").length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {currentRequests.filter((r: any) => r.status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {currentRequests.filter((r: any) => r.status === "denied").length}
                </div>
                <div className="text-sm text-muted-foreground">Denied</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AccessHistory;