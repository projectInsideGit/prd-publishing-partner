import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      if (!profile) throw new Error('Profile not found');

      return profile;
    }
  });

  useEffect(() => {
    if (profile) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'seller':
          navigate('/seller');
          break;
        case 'buyer':
          navigate('/buyer');
          break;
        case 'transporter':
          navigate('/transporter');
          break;
        default:
          console.error('Unknown role:', profile.role);
      }
    }
  }, [profile, navigate]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorDisplay message={error instanceof Error ? error.message : 'An error occurred'} />;

  return <LoadingState />;
};

export default Dashboard;