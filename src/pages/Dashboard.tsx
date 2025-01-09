import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

        // Fetch user profile using maybeSingle() instead of single()
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile data. Please try again later.');
          return;
        }

        if (!profile) {
          setError('Profile not found. Please contact support.');
          return;
        }

        setProfile(profile);
      } catch (err) {
        console.error('Error in checkUser:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {profile && (
              <div className="space-y-2">
                <p className="text-lg">Welcome, {profile.full_name}</p>
                <p>Role: {profile.role}</p>
                {profile.company_name && <p>Company: {profile.company_name}</p>}
                {profile.phone && <p>Phone: {profile.phone}</p>}
              </div>
            )}
            
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;