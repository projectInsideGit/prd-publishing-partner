import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, History } from "lucide-react";

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your cotton waste inventory</p>
            <Button onClick={() => navigate("/seller/inventory")}>
              Manage Inventory
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Sales History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View your sales history</p>
            <Button onClick={() => navigate("/seller/sales")}>
              View Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;