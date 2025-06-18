import { AdminSidebar } from '@/components/shared/AdminSidebar';
import { AuthCheck } from '@/components/shared/AuthCheck';
import { AdminHeader } from '@/components/shared/AdminHeader';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck adminOnly>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
} 