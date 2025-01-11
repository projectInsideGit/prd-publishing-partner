import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { InventoryTable } from "@/components/seller/InventoryTable";
import type { Database } from "@/integrations/supabase/types";

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

const InventoryManagement = () => {
  const navigate = useNavigate();
  
  const { data: inventory, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorDisplay message={error.message} />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={() => navigate("/seller/inventory/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {inventory && inventory.length > 0 ? (
            <InventoryTable items={inventory} />
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No inventory items found. Start by adding a new item.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;