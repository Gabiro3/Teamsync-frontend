import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileTextIcon, LinkIcon, UserIcon } from "lucide-react";
import { getTagColor } from "@/lib/tagColor";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";
import DeleteReportCard from "../settings/delete-report-card";
interface ReportCardProps {
  id: string;
  title: string;
  tag: string;
  description: string;
  file_url: string;
  created_at: Date;
  workspace_id: string;
  created_by: string;
}

export function ReportCard({ id, title, tag, created_at, created_by, file_url, description }: ReportCardProps) {
  const workspaceId = useWorkspaceId()

  const handleCopyLink = () => {
    const reportLink = `${window.location.origin}/workspace/${workspaceId}/reports/${id}`;
    navigator.clipboard.writeText(reportLink).then(() => {
      toast({
        title: "Report link copied",
        description: "Report link copied successfully!",
        variant: "success",
      });
    });
  };
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent className="flex flex-col space-y-4">
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
      <UserIcon className="h-4 w-4" />
      <span>{created_by}</span>
    </div>
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <CalendarIcon className="h-4 w-4" />
      <span>{created_at.toLocaleDateString()}</span>
    </div>
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <FileTextIcon className="h-4 w-4" />
      <span>{description}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="secondary" className={getTagColor(tag)}>
        {tag}
      </Badge>
    </div>
    <div className="flex flex-wrap gap-4 justify-between mt-4">
      <Button onClick={handleCopyLink} variant="secondary">
        Copy Report Link
      </Button>
      <a
        href={file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
      >
        <Button>
          <LinkIcon className="mr-2 h-4 w-2" />
          Full Report
        </Button>
      </a>
      <div className="pt-2">
              <DeleteReportCard reportId={id} />
            </div>
    </div>
  </CardContent>
</Card>

  );
}



