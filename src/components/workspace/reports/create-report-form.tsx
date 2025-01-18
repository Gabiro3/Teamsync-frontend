import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-provider";
import { createReportMutationFn } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function CreateReportForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createReportMutationFn,
  });

  const formSchema = z.object({
    title: z.string().trim().min(1, {
      message: "Report title is required",
    }),
    description: z.string().trim(),
    file_url: z.string().url(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      file_url: "",
    },
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    const data = {
      ...values,
      id: uuidv4(),
      created_by: user?.email,
      workspace_id: workspaceId,
      tag: "Report",
    };
    mutate(
      { workspaceId: workspaceId!, data },
      {
        onSuccess: () => {
          queryClient.resetQueries({
            queryKey: ["userReports"],
          });
          toast({
            title: "Report created",
            description: "Report created successfully!",
            variant:"success"
          })

          onClose();
          navigate(`/workspace/${workspaceId}/`);
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
    <main className="w-full flex flex-row min-h-[290px] h-auto max-w-full">
      <div className="h-full px-5 py-5 flex-1">
        <div className="mb-5">
          <h1
            className="text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            File a new report
          </h1>
          <p className="text-muted-foreground text-lg leading-tight">
            Boost your productivity by making it easier for everyone to access
            reports in one location.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Report title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Action plan Q2"
                        className="!h-[48px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the title of your report. Make it short and descriptive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Report description
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="This report serves as a guide for the team to follow in the next quarter of the year."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Get your members on board with a few words about your
                      report.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-2">
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Report URL
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://docs.google.com/document/d/..."
                        className="!h-[48px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a link to the report document (e.g., Google Docs, Google Drive).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isPending}
              className="w-full h-[40px] text-white font-semibold"
              type="submit"
            >
              {isPending && <Loader className="animate-spin" />}
              Upload report
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="relative flex-1 shrink-0 hidden bg-muted md:block
      bg-[url('/images/docs.jpg')] bg-cover bg-center h-full
      "
      />
    </main>
  );
}