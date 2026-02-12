
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Circle, Trash2, Edit } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";






export function TaskCard({ task, onEdit }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user has permission (admin or owner)
  const canEdit = user?.role === "admin" || task.userId === user?.id;

  const handleStatusToggle = () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateTask.mutate(
      { id: task.id, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Status Updated",
            description: `Task marked as ${newStatus}`
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message
          });
        }
      }
    );
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast({
          title: "Task Deleted",
          description: "The task has been permanently removed."
        });
      },
      onError: (err) => {
        setIsDeleting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message
        });
      }
    });
  };

  return (/*#__PURE__*/
    React.createElement(motion.div, {
      layout: true,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.3 } }, /*#__PURE__*/

    React.createElement(Card, { className: `group relative overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/60 ${task.status === 'completed' ? 'bg-muted/30' : 'bg-card'}` }, /*#__PURE__*/

    React.createElement("div", { className: `absolute left-0 top-0 bottom-0 w-1 ${task.status === 'completed' ? 'bg-green-500' : 'bg-primary'}` }), /*#__PURE__*/

    React.createElement(CardHeader, { className: "flex flex-row items-start justify-between space-y-0 pb-2 pl-6" }, /*#__PURE__*/
    React.createElement("div", { className: "flex gap-2 items-center" }, /*#__PURE__*/
    React.createElement(Badge, {
      variant: task.status === "completed" ? "secondary" : "default",
      className: `${task.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-primary/10 text-primary hover:bg-primary/20'} transition-colors duration-200` },

    task.status === "completed" ? "Completed" : "In Progress"
    ),
    user?.role === "admin" && task.userId !== user.id && /*#__PURE__*/
    React.createElement(Badge, { variant: "outline", className: "text-[10px] h-5" }, "User #", task.userId)

    )
    ), /*#__PURE__*/

    React.createElement(CardContent, { className: "pl-6 pb-2" }, /*#__PURE__*/
    React.createElement("h3", { className: `font-display text-lg font-semibold leading-tight mb-2 ${task.status === 'completed' ? 'text-muted-foreground line-through decoration-border' : 'text-foreground'}` },
    task.title
    ), /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]" },
    task.description || "No description provided."
    )
    ), /*#__PURE__*/

    React.createElement(CardFooter, { className: "flex justify-between pl-6 pt-4 border-t border-border/40 bg-muted/5" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      className: "text-muted-foreground hover:text-primary pl-0 -ml-2",
      onClick: handleStatusToggle,
      disabled: !canEdit || updateTask.isPending },

    task.status === "completed" ? /*#__PURE__*/
    React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Circle, { className: "mr-2 h-4 w-4" }), " Mark Pending") : /*#__PURE__*/

    React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CheckCircle2, { className: "mr-2 h-4 w-4" }), " Mark Complete")

    ),

    canEdit && /*#__PURE__*/
    React.createElement("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" }, /*#__PURE__*/
    React.createElement(Button, {
      variant: "ghost",
      size: "icon",
      className: "h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50",
      onClick: () => onEdit(task) }, /*#__PURE__*/

    React.createElement(Edit, { className: "h-4 w-4" })
    ), /*#__PURE__*/
    React.createElement(Button, {
      variant: "ghost",
      size: "icon",
      className: "h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50",
      onClick: handleDelete,
      disabled: isDeleting }, /*#__PURE__*/

    React.createElement(Trash2, { className: "h-4 w-4" })
    )
    )

    )
    )
    ));

}