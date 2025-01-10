import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Building2, Phone, Mail } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { ProfileInfoCard } from "@/components/dashboard/ProfileInfoCard";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { LoadingState } from "@/components/dashboard/LoadingState";

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

        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to load profile data. Please try again later.');
          return;
        }

        if (!existingProfile) {
          console.log('No profile found, creating new profile...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                full_name: '',
                role: 'buyer'
              }
            ])
            .select()
            .maybeSingle();

          if (insertError) {
            console.error('Failed to create profile:', insertError);
            setError('Failed to create your profile. Please contact support.');
            return;
          }

          if (!newProfile) {
            console.error('Profile creation succeeded but no data returned');
            setError('Error setting up your profile. Please try refreshing the page.');
            return;
          }

          console.log('New profile created successfully:', newProfile);
          setProfile(newProfile);
        } else {
          console.log('Existing profile found:', existingProfile);
          setProfile(existingProfile);
        }

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
    return <LoadingState />;
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
            <ErrorDisplay message={error} />
          ) : profile ? (
            <div className="space-y-6">
              <ProfileHeader profile={profile} />
              <div className="grid gap-4 md:grid-cols-2">
                {email && (
                  <ProfileInfoCard
                    icon={Mail}
                    label="Email"
                    value={email}
                  />
                )}
                {profile.company_name && (
                  <ProfileInfoCard
                    icon={Building2}
                    label="Company"
                    value={profile.company_name}
                  />
                )}
                {profile.phone && (
                  <ProfileInfoCard
                    icon={Phone}
                    label="Phone"
                    value={profile.phone}
                  />
                )}
                <ProfileInfoCard
                  icon={CalendarDays}
                  label="Member Since"
                  value={new Date(profile.created_at).toLocaleDateString()}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;