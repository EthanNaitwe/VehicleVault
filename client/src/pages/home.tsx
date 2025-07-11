import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Car, Check, Handshake, DollarSign, Plus, BarChart3, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const recentVehicles = vehicles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-muted-foreground">Overview of your dealership performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? "..." : stats?.totalVehicles || 0}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <Car className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statsLoading ? "..." : stats?.availableVehicles || 0}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Check className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sold This Month</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statsLoading ? "..." : stats?.soldThisMonth || 0}
                  </p>
                </div>
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Handshake className="text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? "..." : `$${stats?.totalRevenue?.toLocaleString() || 0}`}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <DollarSign className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Recent Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading vehicles...</p>
                  </div>
                ) : recentVehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No vehicles found</p>
                    <Link href="/inventory">
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Vehicle
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentVehicles.map((vehicle: any) => (
                      <div key={vehicle.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                        <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className={`text-sm ${
                            vehicle.status === 'available' ? 'text-green-600' :
                            vehicle.status === 'sold' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${vehicle.askingPrice ? parseFloat(vehicle.askingPrice).toLocaleString() : 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(vehicle.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/inventory">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vehicle
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </Link>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
