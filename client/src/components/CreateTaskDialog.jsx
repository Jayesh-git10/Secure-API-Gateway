function _extends() {return _extends = Object.assign ? Object.assign.bind() : function (n) {for (var e = 1; e < arguments.length; e++) {var t = arguments[e];for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);}return n;}, _extends.apply(null, arguments);}import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from

"@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";

import { useEffect } from "react";
import { useForm } from "react-hook-form";


// Schema for the form - title is required
const formSchema = insertTaskSchema.pick({ title: true, description: true, status: true });








export function CreateTaskDialog({ editTask, open, onOpenChange }) {
  const { toast } = useToast();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending"
    }
  });

  useEffect(() => {
    if (editTask) {
      form.reset({
        title: editTask.title,
        description: editTask.description || "",
        status: editTask.status
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "pending"
      });
    }
  }, [editTask, form, open]);

  const onSubmit = (data) => {
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
              description: error.message
            });
          }
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
            description: error.message
          });
        }
      });
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (/*#__PURE__*/
    React.createElement(Dialog, { open: open, onOpenChange: onOpenChange }, /*#__PURE__*/
    React.createElement(DialogContent, { className: "sm:max-w-[425px]" }, /*#__PURE__*/
    React.createElement(DialogHeader, null, /*#__PURE__*/
    React.createElement(DialogTitle, null, editTask ? "Edit Task" : "Create New Task"), /*#__PURE__*/
    React.createElement(DialogDescription, null,
    editTask ?
    "Make changes to your task here." :
    "Add a new task to your dashboard."
    )
    ), /*#__PURE__*/
    React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-4" }, /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "title" }, "Title"), /*#__PURE__*/
    React.createElement(Input, _extends({
      id: "title",
      placeholder: "e.g. Review Q3 Reports" },
    form.register("title"), {
      className: "col-span-3 focus-visible:ring-primary" })
    ),
    form.formState.errors.title && /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.title.message)

    ), /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "description" }, "Description"), /*#__PURE__*/
    React.createElement(Textarea, _extends({
      id: "description",
      placeholder: "Add details about this task..." },
    form.register("description"), {
      className: "resize-none min-h-[100px] focus-visible:ring-primary" })
    )
    ), /*#__PURE__*/
    React.createElement(DialogFooter, null, /*#__PURE__*/
    React.createElement(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false) }, "Cancel"

    ), /*#__PURE__*/
    React.createElement(Button, { type: "submit", disabled: isPending, className: "bg-primary hover:bg-primary/90" },
    isPending ? "Saving..." : editTask ? "Save Changes" : "Create Task"
    )
    )
    )
    )
    ));

}