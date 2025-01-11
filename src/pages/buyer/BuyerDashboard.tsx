import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock } from "lucide-react";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Available Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Browse available cotton waste products</p>
            <Button onClick={() => navigate("/buyer/products")}>
              Browse Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View your order history</p>
            <Button onClick={() => navigate("/buyer/orders")}>
              View Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;