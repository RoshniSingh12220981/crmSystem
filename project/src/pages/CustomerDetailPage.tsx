import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Package
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, getOrdersByCustomerId } = useData();
  
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (id) {
      const customerData = getCustomerById(id);
      if (customerData) {
        setCustomer(customerData);
        
        const customerOrders = getOrdersByCustomerId(id);
        setOrders(customerOrders);
      } else {
        // Customer not found, redirect to customers page
        navigate('/customers');
      }
    }
  }, [id, getCustomerById, getOrdersByCustomerId, navigate]);

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const orderColumns = [
    {
      header: 'Order ID',
      accessor: 'id',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Date',
      accessor: (row: Order) => (
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(row.date)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Order) => (
        <div className="flex items-center">
          <Package size={16} className="mr-2 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'completed' 
              ? 'bg-success-100 text-success-800' 
              : row.status === 'cancelled'
              ? 'bg-error-100 text-error-800'
              : 'bg-warning-100 text-warning-800'
          }`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: Order) => formatCurrency(row.amount),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          leftIcon={<ArrowLeft size={16} />}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500 mt-1">Customer details and order history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-2">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <User size={32} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <div className="flex items-center mt-1">
                    <User size={16} className="mr-2 text-gray-500" />
                    <p className="text-gray-900">{customer.name}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center mt-1">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <div className="flex items-center mt-1">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <p className="text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Since</p>
                  <div className="flex items-center mt-1">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Edit Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-primary-100 text-primary-600">
                    <DollarSign size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Spend</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">
                      {formatCurrency(customer.totalSpend)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-secondary-100 text-secondary-600">
                    <ShoppingCart size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">
                      {customer.totalOrders}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-accent-100 text-accent-600">
                    <Clock size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Visits</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">
                      {customer.totalVisits}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={orders}
                columns={orderColumns}
                emptyMessage="No orders found for this customer."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;