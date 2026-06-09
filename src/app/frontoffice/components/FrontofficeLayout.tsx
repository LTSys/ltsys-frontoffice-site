import { ReactNode } from 'react';
  import { StudentHeader } from './StudentHeader';

interface FrontofficeLayoutProps {
  children: ReactNode;
  activeItem?: string;
  title?: string;
}

export function FrontofficeLayout({ children, title, activeItem }: FrontofficeLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif]">
      <StudentHeader title={title} />

      <main className="p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );  
}
