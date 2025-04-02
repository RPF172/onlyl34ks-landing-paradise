
import { useNavigate } from 'react-router-dom';
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
