import React, { useState } from 'react';
import { Plus, Trash2, Users, Filter, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { Customer, SegmentRule } from '../types';
import { generateId } from '../lib/utils';

const operators = [
  { value: 'gt', label: 'Greater than (>)' },
  { value: 'gte', label: 'Greater than or equal to (≥)' },
  { value: 'lt', label: 'Less than (<)' },
  { value: 'lte', label: 'Less than or equal to (≤)' },
  { value: 'eq', label: 'Equal to (=)' },
];

const fields = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'totalOrders', label: 'Total Orders' },
  { value: 'totalVisits', label: 'Total Visits' },
];

const SegmentsPage: React.FC = () => {
  const { segments, customers, addSegment, previewSegment } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [rules, setRules] = useState<SegmentRule[]>([
    { id: generateId(), field: 'totalSpend', operator: 'gt', value: 0 },
  ]);
  const [previewCustomers, setPreviewCustomers] = useState<Customer[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const addRule = () => {
    setRules([
      ...rules,
      { id: generateId(), field: 'totalSpend', operator: 'gt', value: 0 },
    ]);
  };

  const removeRule = (id: string) => {
    if (rules.length === 1) return;
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, field: string, value: any) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handlePreview = async () => {
    setIsPreviewLoading(true);
    try {
      const matchingCustomers = await previewSegment(rules);
      setPreviewCustomers(matchingCustomers);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSaveSegment = async () => {
    if (!segmentName.trim()) return;

    await addSegment({
      name: segmentName,
      rules,
      createdBy: '1', // Current user ID
    });

    // Reset form
    setSegmentName('');
    setRules([{ id: generateId(), field: 'totalSpend', operator: 'gt', value: 0 }]);
    setPreviewCustomers([]);
    setShowAddForm(false);
  };

  const segmentColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Rules',
      accessor: (segment: any) => (
        <div className="flex flex-wrap gap-2">
          {segment.rules.map((rule: SegmentRule, index: number) => (
            <span
              key={rule.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {fields.find((f) => f.value === rule.field)?.label || rule.field}{' '}
              {operators.find((o) => o.value === rule.operator)?.label.split(' ')[0] || rule.operator}{' '}
              {rule.value}
              {index < segment.rules.length - 1 && ' AND '}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (segment: any) => new Date(segment.createdAt).toLocaleDateString(),
    },
    {
      header: 'Matching Customers',
      accessor: (segment: any) => {
        const matchCount = customers.filter((customer) => {
          return segment.rules.every((rule: SegmentRule) => {
            const field = rule.field;
            const operator = rule.operator;
            const value = rule.value;
            const customerValue = customer[field as keyof Customer];

            if (typeof customerValue !== 'number') return false;

            switch (operator) {
              case 'gt':
                return customerValue > value;
              case 'gte':
                return customerValue >= value;
              case 'lt':
                return customerValue < value;
              case 'lte':
                return customerValue <= value;
              case 'eq':
                return customerValue === value;
              default:
                return false;
            }
          });
        }).length;

        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
            <UserCheck size={14} className="mr-1" />
            {matchCount} customers
          </span>
        );
      },
    },
  ];

  const previewColumns = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Total Orders',
      accessor: 'totalOrders',
    },
    {
      header: 'Total Spend',
      accessor: (customer: Customer) => `$${customer.totalSpend.toFixed(2)}`,
    },
    {
      header: 'Total Visits',
      accessor: 'totalVisits',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
          <p className="text-gray-500 mt-1">Create and manage customer segments for targeted campaigns</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus size={16} />}
        >
          Create Segment
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle>Create New Segment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Segment Name"
              placeholder="e.g., High Spenders, New Customers"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              required
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Rules</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addRule}
                  leftIcon={<Plus size={14} />}
                >
                  Add Rule
                </Button>
              </div>
              
              {rules.map((rule, index) => (
                <div key={rule.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Field</label>
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                      >
                        {fields.map((field) => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Operator</label>
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={rule.operator}
                        onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                      >
                        {operators.map((operator) => (
                          <option key={operator.value} value={operator.value}>
                            {operator.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                      <input
                        type="number"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, 'value', Number(e.target.value))}
                        min="0"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-error-600 disabled:opacity-50"
                        onClick={() => removeRule(rule.id)}
                        disabled={rules.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {index < rules.length - 1 && (
                    <div className="mt-2 text-xs font-medium text-gray-500 text-center">AND</div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  leftIcon={<Filter size={16} />}
                  isLoading={isPreviewLoading}
                >
                  Preview Matching Customers
                </Button>
              </div>

              {previewCustomers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Matching Customers ({previewCustomers.length})
                  </h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <DataTable
                      data={previewCustomers}
                      columns={previewColumns}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSegment}>
              Save Segment
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          data={segments}
          columns={segmentColumns}
          emptyMessage="No segments found. Create a new segment to get started."
        />
      </div>
    </div>
  );
};

export default SegmentsPage;