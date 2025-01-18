import ReportForm from "./create-report-form";
import useCreateReportDialog from "@/hooks/use-create-report-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const CreateReportDialog = () => {
  const { open, onClose } = useCreateReportDialog();

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl !p-0 overflow-hidden border-0" aria-description="dialog content form">
        <ReportForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
