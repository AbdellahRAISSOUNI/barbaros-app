import { ClientSidebar } from '@/components/shared/ClientSidebar';
import { ClientHeader } from '@/components/shared/ClientHeader';
import { AuthCheck } from '@/components/shared/AuthCheck';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck clientOnly>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <ClientSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ClientHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
} 