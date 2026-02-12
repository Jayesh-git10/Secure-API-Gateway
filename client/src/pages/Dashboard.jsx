import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { TaskCard } from "@/components/TaskCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";


import { LayoutDashboard, LogOut, Plus, Search, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [_, setLocation] = useLocation();
  const { data: tasks, isLoading, error } = useTasks();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Redirect if not logged in
  if (!token) {
    setLocation("/");
    return null;
  }

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks?.filter((task) =>
  task.title.toLowerCase().includes(search.toLowerCase()) ||
  task.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (/*#__PURE__*/
    React.createElement("div", { className: "min-h-screen bg-muted/20" }, /*#__PURE__*/

    React.createElement("header", { className: "sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" }, /*#__PURE__*/
    React.createElement("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" }, /*#__PURE__*/
    React.createElement("div", { className: "flex items-center gap-3" }, /*#__PURE__*/
    React.createElement("div", { className: "bg-primary/10 p-2 rounded-lg" }, /*#__PURE__*/
    React.createElement(LayoutDashboard, { className: "h-5 w-5 text-primary" })
    ), /*#__PURE__*/
    React.createElement("h1", { className: "font-display font-bold text-xl hidden sm:block" }, "TaskMaster Pro")
    ), /*#__PURE__*/

    React.createElement("div", { className: "flex items-center gap-4" }, /*#__PURE__*/
    React.createElement("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full" },
    user?.role === 'admin' ? /*#__PURE__*/
    React.createElement(ShieldCheck, { className: "w-4 h-4 text-primary" }) : /*#__PURE__*/

    React.createElement(User, { className: "w-4 h-4 text-muted-foreground" }), /*#__PURE__*/

    React.createElement("span", { className: "text-sm font-medium" },
    user?.username, /*#__PURE__*/
    React.createElement("span", { className: "text-muted-foreground ml-1 font-normal" }, "(", user?.role, ")")
    )
    ), /*#__PURE__*/
    React.createElement(Button, { variant: "ghost", size: "sm", onClick: logout, className: "text-muted-foreground hover:text-destructive hover:bg-destructive/10" }, /*#__PURE__*/
    React.createElement(LogOut, { className: "w-4 h-4 mr-2" }), "Logout"

    )
    )
    )
    ), /*#__PURE__*/


    React.createElement("main", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8" }, /*#__PURE__*/

    React.createElement("div", { className: "flex flex-col md:flex-row gap-4 justify-between items-center mb-8" }, /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h2", { className: "text-3xl font-display font-bold text-foreground" }, "Dashboard"), /*#__PURE__*/
    React.createElement("p", { className: "text-muted-foreground mt-1" }, "Manage your tasks and track progress."

    )
    ), /*#__PURE__*/

    React.createElement("div", { className: "flex gap-3 w-full md:w-auto" }, /*#__PURE__*/
    React.createElement("div", { className: "relative w-full md:w-64" }, /*#__PURE__*/
    React.createElement(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /*#__PURE__*/
    React.createElement(Input, {
      placeholder: "Search tasks...",
      className: "pl-9 bg-background focus-visible:ring-primary",
      value: search,
      onChange: (e) => setSearch(e.target.value) }
    )
    ), /*#__PURE__*/
    React.createElement(Button, { onClick: handleCreate, className: "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5" }, /*#__PURE__*/
    React.createElement(Plus, { className: "w-4 h-4 mr-2" }), "New Task"

    )
    )
    ),


    isLoading ? /*#__PURE__*/
    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
    [1, 2, 3, 4, 5, 6].map((i) => /*#__PURE__*/
    React.createElement("div", { key: i, className: "space-y-3" }, /*#__PURE__*/
    React.createElement(Skeleton, { className: "h-[200px] w-full rounded-xl" })
    )
    )
    ) :
    error ? /*#__PURE__*/
    React.createElement("div", { className: "text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20" }, /*#__PURE__*/
    React.createElement("h3", { className: "text-lg font-semibold text-destructive" }, "Failed to load tasks"), /*#__PURE__*/
    React.createElement("p", { className: "text-muted-foreground" }, error.message)
    ) :
    filteredTasks?.length === 0 ? /*#__PURE__*/
    React.createElement("div", { className: "text-center py-20 bg-background rounded-2xl border border-dashed border-border" }, /*#__PURE__*/
    React.createElement("div", { className: "bg-muted inline-flex p-4 rounded-full mb-4" }, /*#__PURE__*/
    React.createElement(LayoutDashboard, { className: "w-8 h-8 text-muted-foreground" })
    ), /*#__PURE__*/
    React.createElement("h3", { className: "text-lg font-semibold" }, "No tasks found"), /*#__PURE__*/
    React.createElement("p", { className: "text-muted-foreground max-w-sm mx-auto mt-2 mb-6" }, "You don't have any tasks yet. Create one to get started with your productivity journey."

    ), /*#__PURE__*/
    React.createElement(Button, { onClick: handleCreate, variant: "outline" }, /*#__PURE__*/
    React.createElement(Plus, { className: "w-4 h-4 mr-2" }), "Create First Task"

    )
    ) : /*#__PURE__*/

    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
    filteredTasks?.map((task) => /*#__PURE__*/
    React.createElement(TaskCard, {
      key: task.id,
      task: task,
      onEdit: handleEdit }
    )
    )
    )

    ), /*#__PURE__*/

    React.createElement(CreateTaskDialog, {
      open: isDialogOpen,
      onOpenChange: setIsDialogOpen,
      editTask: editingTask }
    )
    ));

}