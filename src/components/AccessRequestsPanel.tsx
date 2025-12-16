import { motion } from "framer-motion";
import { User, Check, X, Clock, Users } from "lucide-react";
import { useIncomingAccessRequests, useUpdateAccessRequest, useDeleteAccessRequest } from "@/hooks/useAccessRequests";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/LazyImage";
import { toast } from "sonner";

interface AccessRequestsPanelProps {
  ownerUid: string;
}

const AccessRequestsPanel = ({ ownerUid }: AccessRequestsPanelProps) => {
  const { data: requests, isLoading } = useIncomingAccessRequests(ownerUid);
  const updateRequest = useUpdateAccessRequest();
  const deleteRequest = useDeleteAccessRequest();

  const pendingRequests = requests?.filter((r: any) => r.status === "pending") || [];
  const processedRequests = requests?.filter((r: any) => r.status !== "pending") || [];

  const handleApprove = async (requestId: string) => {
    try {
      await updateRequest.mutateAsync({ requestId, status: "approved" });
      toast.success("Access granted!");
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      await updateRequest.mutateAsync({ requestId, status: "denied" });
      toast.success("Request denied");
    } catch (error) {
      toast.error("Failed to deny request");
    }
  };

  const handleRevoke = async (requestId: string) => {
    try {
      await deleteRequest.mutateAsync(requestId);
      toast.success("Access revoked");
    } catch (error) {
      toast.error("Failed to revoke access");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Access Requests
        </h2>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request: any, index: number) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {request.requester?.profile_image ? (
                      <LazyImage
                        src={request.requester.profile_image}
                        alt={request.requester?.name || "User"}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {request.requester?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      UID: {request.requester_uid}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(request.id)}
                    disabled={updateRequest.isPending}
                    className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeny(request.id)}
                    disabled={updateRequest.isPending}
                    className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                    Deny
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Users */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Access History
          </h3>
          <div className="space-y-2">
            {processedRequests.map((request: any) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {request.requester?.profile_image ? (
                      <LazyImage
                        src={request.requester.profile_image}
                        alt={request.requester?.name || "User"}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {request.requester?.name || "Unknown"}
                    </p>
                    <span
                      className={`text-xs ${
                        request.status === "approved"
                          ? "text-green-600 dark:text-green-400"
                          : "text-destructive"
                      }`}
                    >
                      {request.status === "approved" ? "Has access" : "Denied"}
                    </span>
                  </div>
                </div>
                {request.status === "approved" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRevoke(request.id)}
                    disabled={deleteRequest.isPending}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!requests || requests.length === 0) && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No access requests yet</p>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsPanel;
