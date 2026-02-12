import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type Task } from "@shared/schema";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema for the form - title is required
const formSchema = insertTaskSchema.pick({ title: true, description: true, status: true });
type FormValues = z.infer<typeof formSchema>;

interface CreateTaskDialogProps {
  editTask?: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ editTask, open, onOpenChange }: CreateTaskDialogProps) {
  const { toast } = useToast();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (editTask) {
      form.reset({
        title: editTask.title,
        description: editTask.description || "",
        status: editTask.status as "pending" | "completed",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "pending",
      });
    }
  }, [editTask, form, open]);

  const onSubmit = (data: FormValues) => {
    if (editTask) {
      updateTask.mutate(
        { id: editTask.id, ...data },
        {
          onSuccess: () => {
            toast({ title: "Success", description: "Task updated successfully" });
            onOpenChange(false);
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          },
        }
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          toast({ title: "Success", description: "Task created successfully" });
          onOpenChange(false);
          form.reset();
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {editTask
              ? "Make changes to your task here."
              : "Add a new task to your dashboard."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Review Q3 Reports"
              {...form.register("title")}
              className="col-span-3 focus-visible:ring-primary"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              {...form.register("description")}
              className="resize-none min-h-[100px] focus-visible:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
              {isPending ? "Saving..." : editTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
