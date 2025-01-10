import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, Phone, Mail, AlertCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session. Please try logging in again.');
          return;
        }

        if (!session) {
          console.log('No session found, redirecting to auth');
          navigate("/auth");
          return;
        }

        console.log("Session user ID:", session.user.id);
        setEmail(session.user.email);

        // Fetch profile with detailed logging
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          if (profileError.code === 'PGRST116') {
            console.log('No profile found for user ID:', session.user.id);
            // Try to create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  full_name: '',
                  role: 'buyer'
                }
              ]);

            if (insertError) {
              console.error('Failed to create profile:', insertError);
              setError('Failed to create your profile. Please contact support.');
            } else {
              // Fetch the newly created profile
              const { data: newProfile, error: newProfileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (newProfileError) {
                console.error('Error fetching new profile:', newProfileError);
                setError('Error loading your new profile. Please try refreshing the page.');
              } else {
                console.log('New profile created:', newProfile);
                setProfile(newProfile);
              }
            }
          } else {
            setError('Failed to load profile data. Please try again later.');
          }
          return;
        }

        if (!profile) {
          console.error('No profile data returned for user:', session.user.id);
          setError('Your profile could not be found. Please contact support.');
          return;
        }

        console.log("Profile loaded successfully:", profile);
        setProfile(profile);
      } catch (err) {
        console.error('Unexpected error in checkUser:', err);
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
      <div className="min-h-screen bg-background p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Dashboard</CardTitle>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : profile ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous User'}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {email && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 opacity-70" />
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      <p className="mt-1 text-sm">{email}</p>
                    </CardContent>
                  </Card>
                )}

                {profile.company_name && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 opacity-70" />
                        <span className="text-sm font-medium">Company</span>
                      </div>
                      <p className="mt-1 text-sm">{profile.company_name}</p>
                    </CardContent>
                  </Card>
                )}

                {profile.phone && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 opacity-70" />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="mt-1 text-sm">{profile.phone}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 opacity-70" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="mt-1 text-sm">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;