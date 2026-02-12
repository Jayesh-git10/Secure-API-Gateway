import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (/*#__PURE__*/
    React.createElement(Switch, null, /*#__PURE__*/
    React.createElement(Route, { path: "/", component: AuthPage }), /*#__PURE__*/
    React.createElement(Route, { path: "/dashboard", component: Dashboard }), /*#__PURE__*/

    React.createElement(Route, { component: NotFound })
    ));

}

function App() {
  return (/*#__PURE__*/
    React.createElement(QueryClientProvider, { client: queryClient }, /*#__PURE__*/
    React.createElement(TooltipProvider, null, /*#__PURE__*/
    React.createElement(Toaster, null), /*#__PURE__*/
    React.createElement(Router, null)
    )
    ));

}

export default App;