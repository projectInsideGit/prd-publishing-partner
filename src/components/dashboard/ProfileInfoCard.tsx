import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const ProfileInfoCard = ({ icon: Icon, label, value }: ProfileInfoCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 opacity-70" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-1 text-sm">{value}</p>
    </CardContent>
  </Card>
);