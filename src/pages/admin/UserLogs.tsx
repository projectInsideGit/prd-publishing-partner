import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type UserLog = Database['public']['Tables']['user_logs']['Row'] & {
  profiles?: {
    full_name: string | null;
    company_name: string | null;
  } | null;
};

const UserLogs = () => {
  const navigate = useNavigate();

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      console.log('Fetching user logs...');
      const { data, error } = await supabase
        .from('user_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching logs:', error);
        throw error;
      }

      console.log('Fetched logs:', data);
      return data as UserLog[];
    }
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorDisplay message={(error as Error).message} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">User Activity Logs</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.created_at), 'PPpp')}
              </TableCell>
              <TableCell>
                {log.profiles?.full_name || 'Unknown User'}
                {log.profiles?.company_name && (
                  <span className="text-sm text-gray-500 block">
                    {log.profiles.company_name}
                  </span>
                )}
              </TableCell>
              <TableCell className="capitalize">
                {log.action.replace('_', ' ')}
              </TableCell>
              <TableCell>
                <pre className="text-sm">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserLogs;