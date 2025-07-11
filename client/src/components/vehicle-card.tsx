import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Gauge, Fuel, Settings } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    purchasePrice?: string;
    askingPrice?: string;
    soldPrice?: string;
    status: string;
    imageUrl?: string;
    createdAt: string;
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const profit = vehicle.soldPrice && vehicle.purchasePrice
    ? parseFloat(vehicle.soldPrice) - parseFloat(vehicle.purchasePrice)
    : vehicle.askingPrice && vehicle.purchasePrice
    ? parseFloat(vehicle.askingPrice) - parseFloat(vehicle.purchasePrice)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
        {vehicle.imageUrl ? (
          <img 
            src={vehicle.imageUrl} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <Car className="text-gray-400 w-16 h-16" />
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-foreground">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {vehicle.mileage && (
            <p className="flex items-center">
              <Gauge className="h-4 w-4 mr-2" />
              {vehicle.mileage.toLocaleString()} miles
            </p>
          )}
          {vehicle.fuelType && (
            <p className="flex items-center">
              <Fuel className="h-4 w-4 mr-2" />
              {vehicle.fuelType}
            </p>
          )}
          {vehicle.transmission && (
            <p className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              {vehicle.transmission}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              ${vehicle.status === "sold" 
                ? (vehicle.soldPrice ? parseFloat(vehicle.soldPrice).toLocaleString() : 'N/A')
                : (vehicle.askingPrice ? parseFloat(vehicle.askingPrice).toLocaleString() : 'N/A')
              }
            </p>
            <p className={`text-sm ${profit > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
              {profit > 0 ? `Profit: $${profit.toLocaleString()}` : 'No profit data'}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
