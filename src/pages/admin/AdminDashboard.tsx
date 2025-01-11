import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Settings, FileText } from "lucide-react";
import UserManagement from "./UserManagement";
import UserLogs from "./UserLogs";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Routes>
        <Route path="/" element={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage users and their roles</p>
                <Button onClick={() => navigate("users")}>
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  User Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">View system activity logs</p>
                <Button onClick={() => navigate("logs")}>
                  View Logs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure system settings</p>
                <Button onClick={() => navigate("settings")}>
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="users" element={<UserManagement />} />
        <Route path="logs" element={<UserLogs />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;