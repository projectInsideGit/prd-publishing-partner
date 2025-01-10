import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => (
  <div className="min-h-screen bg-background p-4">
    <Card>
      <CardContent className="p-6">
        <p className="text-center">Loading your profile...</p>
      </CardContent>
    </Card>
  </div>
);