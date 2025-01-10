import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => (
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
);