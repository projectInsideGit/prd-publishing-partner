import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type UserRole = Database['public']['Enums']['user_role'];

const RoleDescription = ({ role }: { role: UserRole }) => {
  const descriptions = {
    buyer: "Browse and purchase cotton waste products",
    seller: "List and manage your cotton waste inventory",
    admin: "Manage users and oversee all platform activities",
    transporter: "Manage shipments and deliveries"
  };

  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold mb-2">Welcome {role}!</h2>
      <p className="text-gray-600">{descriptions[role]}</p>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile) {
            console.log('User role:', profile.role);
            setRole(profile.role);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Cotton Waste Trading Platform</h1>
        <p className="text-xl text-gray-600">Connect, Trade, and Grow Your Business</p>
        
        {role ? (
          <>
            <RoleDescription role={role} />
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </>
        ) : (
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;