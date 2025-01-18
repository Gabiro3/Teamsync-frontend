import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, UserIcon, LinkIcon } from "lucide-react";
import { getTagColor } from "@/lib/tagColor";

interface Report {
  id: string;
  title: string;
  postedBy: string;
  postedDate: string;
  tags: string[];
  description: string;
  link: string;
}

interface ReportPageProps {
  report: Report | null;
}

const ReportPage: React.FC<ReportPageProps> = ({ report }) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
        <Button variant="outline" onClick={() => navigate(`/workspace/${workspaceId}/reports`)}>
          Back to Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
        Back to Reports
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{report.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <UserIcon className="h-4 w-4" />
            <span>{report.postedBy}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground mb-4">
            <CalendarIcon className="h-4 w-4" />
            <span>{report.postedDate}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {report.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className={getTagColor(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
          <p className="mb-4">{report.description}</p>
          <a
            href={report.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Button>
              <LinkIcon className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
