import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Cotton Waste Trading Platform</h1>
        <p className="text-xl text-gray-600">Connect, Trade, and Grow Your Business</p>
        <Button 
          size="lg"
          onClick={() => navigate("/auth")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;