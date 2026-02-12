import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (/*#__PURE__*/
    React.createElement("div", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50" }, /*#__PURE__*/
    React.createElement(Card, { className: "w-full max-w-md mx-4 shadow-xl border-0" }, /*#__PURE__*/
    React.createElement(CardContent, { className: "pt-6" }, /*#__PURE__*/
    React.createElement("div", { className: "flex mb-4 gap-2" }, /*#__PURE__*/
    React.createElement(AlertCircle, { className: "h-8 w-8 text-red-500" }), /*#__PURE__*/
    React.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "404 Page Not Found")
    ), /*#__PURE__*/

    React.createElement("p", { className: "mt-4 text-sm text-gray-600" }, "The page you are looking for does not exist or has been moved."

    ), /*#__PURE__*/

    React.createElement("div", { className: "mt-6" }, /*#__PURE__*/
    React.createElement(Link, { href: "/", className: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full" }, "Return to Home"

    )
    )
    )
    )
    ));

}