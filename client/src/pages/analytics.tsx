import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, RefreshCw, Percent } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const soldVehicles = vehicles?.filter((v: any) => v.status === "sold") || [];
  const topPerformers = soldVehicles
    .slice(0, 5)
    .map((v: any) => ({
      ...v,
      profit: v.soldPrice && v.purchasePrice ? 
        parseFloat(v.soldPrice) - parseFloat(v.purchasePrice) : 0
    }))
    .sort((a: any, b: any) => b.profit - a.profit);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">Track your dealership's performance and profitability</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                <DollarSign className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                ${statsLoading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600">Current total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Average Profit</h3>
                <TrendingUp className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                ${statsLoading ? "..." : Math.round(stats?.averageProfit || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Per vehicle</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Inventory Count</h3>
                <RefreshCw className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                {statsLoading ? "..." : stats?.totalVehicles || 0}
              </p>
              <p className="text-sm text-primary">Total vehicles</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Available</h3>
                <Percent className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                {statsLoading ? "..." : stats?.availableVehicles || 0}
              </p>
              <p className="text-sm text-primary">In stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Top Performing Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclesLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading vehicles...</p>
                </div>
              ) : topPerformers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sold vehicles found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topPerformers.map((vehicle: any, index: number) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-green-600' : 
                          'bg-red-600'
                        }`}></div>
                        <span className="font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${vehicle.soldPrice ? parseFloat(vehicle.soldPrice).toLocaleString() : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Profit: ${vehicle.profit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
