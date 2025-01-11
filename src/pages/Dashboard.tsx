import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Enums"]["user_role"];

const RoleSpecificContent = ({ role }: { role: UserRole }) => {
  switch (role) {
    case "buyer":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Products</h2>
          <p className="text-gray-600">Browse and purchase cotton waste products here.</p>
          {/* Add buyer-specific features here */}
        </div>
      );
    case "seller":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Inventory</h2>
          <p className="text-gray-600">Manage your cotton waste listings here.</p>
          {/* Add seller-specific features here */}
        </div>
      );
    case "admin":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users and platform activities.</p>
          {/* Add admin-specific features here */}
        </div>
      );
    case "transporter":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Shipments</h2>
          <p className="text-gray-600">Manage deliveries and track shipments.</p>
          {/* Add transporter-specific features here */}
        </div>
      );
    default:
      return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profileData) {
          throw new Error("Profile not found");
        }

        console.log("Profile loaded:", profileData);
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.full_name}</h1>
              <p className="text-gray-600">Role: {profile.role}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{profile.full_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{profile.company_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <RoleSpecificContent role={profile.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;