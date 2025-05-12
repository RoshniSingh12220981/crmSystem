import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

const OrdersPage: React.FC = () => {
  const { orders, customers, addOrder } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    amount: 0,
    status: 'pending' as const,
  });

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrder.customerId || newOrder.amount <= 0) return;
    
    const selectedCustomer = customers.find(c => c.id === newOrder.customerId);
    
    if (!selectedCustomer) return;
    
    await addOrder({
      ...newOrder,
      customerName: selectedCustomer.name,
      date: new Date().toISOString(),
    });
    
    // Reset form
    setNewOrder({
      customerId: '',
      amount: 0,
      status: 'pending',
    });
    setShowAddForm(false);
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Customer',
      accessor: (row: Order) => (
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-400" />
          <span>{row.customerName}</span>
        </div>
      ),
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
          <Tag size={16} className="mr-2 text-gray-400" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus size={16} />}
        >
          Add Order
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle>Add New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="w-full">
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    id="customer"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={newOrder.customerId}
                    onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newOrder.amount === 0 ? '' : newOrder.amount}
                  onChange={(e) => setNewOrder({ ...newOrder, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
                <div className="w-full">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ 
                      ...newOrder, 
                      status: e.target.value as 'pending' | 'completed' | 'cancelled'
                    })}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddForm(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400" />}
          />
        </div>
        
        <DataTable
          data={filteredOrders}
          columns={columns}
          onRowClick={(order) => console.log('Clicked order:', order)}
          emptyMessage="No orders found. Add a new order to get started."
        />
      </div>
    </div>
  );
};

export default OrdersPage;