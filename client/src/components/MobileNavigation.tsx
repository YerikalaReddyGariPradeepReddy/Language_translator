import { Link, useLocation } from "wouter";
import { Globe, Mic, MessageCircle, History, Bookmark } from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();

  const navigation = [
    { name: "Translate", href: "/", icon: Globe },
    { name: "Voice", href: "/voice", icon: Mic },
    { name: "Chat", href: "/conversation", icon: MessageCircle },
    { name: "History", href: "/history", icon: History },
    { name: "Saved", href: "/saved", icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? "text-blue-500" 
                  : "text-slate-500 dark:text-slate-400"
              }`}>
                <Icon className="w-5 h-5" />
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
