import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditTaskForm from "./edit-task-form";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";

const EditTaskDialog = (props: {
    projectId?: string, taskData:
        {
            taskId: string;
            title: string;
            description: string;
            status: keyof typeof TaskStatusEnum;
            priority: keyof typeof TaskPriorityEnum;
            assignedTo: string;
            dueDate: Date
        }
}) => {
    const [isOpen, setIsOpen] = useState(true);

    const onClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        setIsOpen(true);
    }, []);

    return (
        <div>
            <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
                    <EditTaskForm
                        projectId={props.projectId}
                        onClose={onClose}
                        taskData={{
                            taskId: props.taskData.taskId,
                            title: props.taskData.title,
                            description: props.taskData.description,
                            projectId: props.projectId || "",
                            status: props.taskData.status,
                            priority: props.taskData.priority,
                            assignedTo: props.taskData.assignedTo,
                            dueDate: props.taskData.dueDate
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditTaskDialog;
