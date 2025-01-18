import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateReportDialog = () => {
  const [open, setOpen] = useQueryState(
    "new-report",
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export default useCreateReportDialog;
