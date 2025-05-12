import React from 'react';
import { Users, ShoppingBasket, Megaphone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { customers, orders, campaigns } = useData();

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

  // Get recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your CRM system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary-100 text-primary-600">
                <Users size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{customers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-secondary-100 text-secondary-600">
                <ShoppingBasket size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{orders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-accent-100 text-accent-600">
                <Megaphone size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{campaigns.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-success-100 text-success-600">
                <TrendingUp size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="py-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(campaign.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${(campaign.totalSuccess / campaign.totalSent) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{campaign.totalSuccess} successful</span>
                    <span>{campaign.totalFailed} failed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;