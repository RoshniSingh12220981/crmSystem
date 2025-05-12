import React, { useState } from 'react';
import { Plus, Search, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { Customer } from '../types';
import { formatCurrency } from '../lib/utils';

const CustomersPage: React.FC = () => {
  const { customers, addCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email) return;
    
    await addCustomer({
      ...newCustomer,
      totalOrders: 0,
      totalSpend: 0,
      totalVisits: 0,
    });
    
    // Reset form
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
    });
    setShowAddForm(false);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: (row: Customer) => (
        <div className="flex items-center">
          <Mail size={16} className="mr-2 text-gray-400" />
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: (row: Customer) => (
        <div className="flex items-center">
          <Phone size={16} className="mr-2 text-gray-400" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Total Orders',
      accessor: 'totalOrders',
      className: 'text-right',
    },
    {
      header: 'Total Spend',
      accessor: (row: Customer) => formatCurrency(row.totalSpend),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer relationships</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus size={16} />}
        >
          Add Customer
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddForm(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400" />}
          />
        </div>
        
        <DataTable
          data={filteredCustomers}
          columns={columns}
          onRowClick={(customer) => console.log('Clicked customer:', customer)}
          emptyMessage="No customers found. Add a new customer to get started."
        />
      </div>
    </div>
  );
};

export default CustomersPage;