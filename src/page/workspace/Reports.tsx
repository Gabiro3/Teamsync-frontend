import { useEffect, useState } from "react";
import { ReportCard } from "@/components/workspace/reports/report-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useCreateReportDialog from "@/hooks/use-create-report-dialog";
import CreateReportDialog from "@/components/workspace/reports/create-report-dialog";
import { getReportsInWorkspaceQueryFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";

export interface Report {
  id: string;
  title: string;
  description: string;
  tag: string;
  file_url: string;
  created_at: string; // Ensure this matches the API response type
  workspace_id: string;
  created_by: string;
}

export default function ReportsDashboard() {
  const { onOpen } = useCreateReportDialog();
  const workspaceId = useWorkspaceId();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to apply default values
  const applyDefaultValues = (report: Partial<Report>): Report => ({
    id: report.id || "unknown-id",
    title: report.title || "Untitled Report",
    description: report.description || "No description available.",
    tag: report.tag || "General",
    file_url: report.file_url || "#",
    created_at: report.created_at || new Date().toISOString(),
    workspace_id: report.workspace_id || "unknown-workspace",
    created_by: report.created_by || "unknown-user",
  });

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const fetchedReports = await getReportsInWorkspaceQueryFn({
          workspaceId,
        });
        // Apply default values to each report
        const processedReports = (fetchedReports as Partial<Report>[]).map(applyDefaultValues);
        setReports(processedReports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (workspaceId) fetchReports();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports Overview</h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview of the reports in this workspace!
          </p>
        </div>
        <Button onClick={onOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Add Report
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length > 0 ? (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              id={report.id}
              title={report.title}
              tag={report.tag}
              created_at={new Date(report.created_at)}
              created_by={report.created_by}
              file_url={report.file_url}
              workspace_id={report.workspace_id}
              description={report.description}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No reports found.</p>
        )}
      </div>

      {/* Create Report Dialog */}
      <CreateReportDialog />
    </div>
  );
}


