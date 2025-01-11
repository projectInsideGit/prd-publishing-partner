import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Map } from "lucide-react";

const TransporterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Transporter Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Active Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your active deliveries</p>
            <Button onClick={() => navigate("/transporter/deliveries")}>
              View Deliveries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Route Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Plan your delivery routes</p>
            <Button onClick={() => navigate("/transporter/routes")}>
              Plan Routes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransporterDashboard;