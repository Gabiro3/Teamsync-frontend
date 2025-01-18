import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteReportMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trash2Icon } from "lucide-react";

const DeleteReportCard = ({ reportId }: { reportId: string }) => {
    const { workspace } = useAuthContext();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId();

    const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteReportMutationFn,
    });

    const handleConfirm = () => {
        mutate(
            { workspaceId, reportId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["userReports"],
                    });
                    toast({
                        title: "Report deleted",
                        description: "Report deleted successfully!",
                        variant: "success",
                      });
                    navigate(`/workspace/${workspaceId}`);
                    setTimeout(() => onCloseDialog(), 100);
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        <>
            <PermissionsGuard
                showMessage
                requiredPermission={Permissions.DELETE_WORKSPACE}
            >
                <Trash2Icon
                    className="shrink-0 flex place-self-end h-[40px] text-red-500 hover:text-red-700"
                    onClick={onOpenDialog}
                />
            </PermissionsGuard>

            <ConfirmDialog
                isOpen={open}
                isLoading={isPending}
                onClose={onCloseDialog}
                onConfirm={handleConfirm}
                title={`Delete ${workspace?.name} Report`}
                description={`Are you sure you want to delete? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};

export default DeleteReportCard;
