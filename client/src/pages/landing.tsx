import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, ChartLine, DollarSign } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-foreground">DealerPro</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-primary hover:bg-primary/90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revolutionize Your <span className="text-blue-300">Dealership</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Track vehicle lifecycles, monitor expenses, and optimize profitability with our comprehensive dealership management system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg h-auto"
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg h-auto"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Vehicle Lifecycle Management</h2>
            <p className="text-xl text-muted-foreground">Everything you need to run a profitable dealership</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Car className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Vehicle Inventory</h3>
                <p className="text-muted-foreground">Track all vehicles from purchase to resale with detailed specifications and photos</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <ChartLine className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Expense Tracking</h3>
                <p className="text-muted-foreground">Monitor all associated costs and automatically calculate optimal selling prices</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <DollarSign className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Profit Analytics</h3>
                <p className="text-muted-foreground">Real-time profitability analysis and revenue optimization insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
