import { ReactNode } from "react";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-6">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
