import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-xl text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;