import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Order, Segment, Campaign, CommunicationLog } from '../types';
import { generateId } from '../lib/utils';

// Sample data
import { mockCustomers } from '../data/mockCustomers';
import { mockOrders } from '../data/mockOrders';
import { mockSegments } from '../data/mockSegments';
import { mockCampaigns } from '../data/mockCampaigns';
import { mockCommunicationLogs } from '../data/mockCommunicationLogs';
import { evaluateSegmentRules } from '../lib/utils';

interface DataContextType {
  customers: Customer[];
  orders: Order[];
  segments: Segment[];
  campaigns: Campaign[];
  communicationLogs: CommunicationLog[];

  // Customer methods
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;

  // Order methods
  addOrder: (order: Omit<Order, 'id'>) => Promise<Order>;
  getOrdersByCustomerId: (customerId: string) => Order[];

  // Segment methods
  addSegment: (segment: Omit<Segment, 'id' | 'createdAt'>) => Promise<Segment>;
  previewSegment: (rules: Segment['rules']) => Promise<Customer[]>;

  // Campaign methods
  addCampaign: (campaign: Omit<Campaign, 'id' | 'sentAt' | 'totalSent' | 'totalSuccess' | 'totalFailed'>) => Promise<Campaign>;
  getCampaignById: (id: string) => Campaign | undefined;
  getCampaignLogs: (campaignId: string) => CommunicationLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);

  // Initialize with mock data
  useEffect(() => {
    setCustomers(mockCustomers);
    setOrders(mockOrders);
    setSegments(mockSegments);
    setCampaigns(mockCampaigns);
    setCommunicationLogs(mockCommunicationLogs);
  }, []);

  // Customer methods
  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === id ? { ...customer, ...customerData } : customer
    );
    setCustomers(updatedCustomers);
    return updatedCustomers.find((customer) => customer.id === id) as Customer;
  };

  const deleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  // Order methods
  const addOrder = async (order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: generateId(),
    };
    setOrders((prev) => [...prev, newOrder]);

    // Update customer totalOrders and totalSpend
    const customer = customers.find((c) => c.id === order.customerId);
    if (customer) {
      updateCustomer(customer.id, {
        totalOrders: customer.totalOrders + 1,
        totalSpend: customer.totalSpend + order.amount,
      });
    }

    return newOrder;
  };

  const getOrdersByCustomerId = (customerId: string) => {
    return orders.filter((order) => order.customerId === customerId);
  };

  // Segment methods
  const addSegment = async (segment: Omit<Segment, 'id' | 'createdAt'>) => {
    const newSegment: Segment = {
      ...segment,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSegments((prev) => [...prev, newSegment]);
    return newSegment;
  };

  const previewSegment = async (rules: Segment['rules']) => {
    return customers.filter((customer) => evaluateSegmentRules(customer, rules));
  };

  // Campaign methods
  const addCampaign = async (
    campaign: Omit<Campaign, 'id' | 'sentAt' | 'totalSent' | 'totalSuccess' | 'totalFailed'>
  ) => {
    // Find the segment
    const segment = segments.find((s) => s.id === campaign.segmentId);
    if (!segment) throw new Error('Segment not found');

    // Find matching customers
    const matchingCustomers = customers.filter((customer) =>
      evaluateSegmentRules(customer, segment.rules)
    );

    // Create success and failure logs
    const newLogs: CommunicationLog[] = [];
    let successCount = 0;
    let failedCount = 0;

    matchingCustomers.forEach((customer) => {
      // Simulate 90% success, 10% failure
      const isSuccess = Math.random() < 0.9;
      const status = isSuccess ? 'SENT' : 'FAILED';
      
      if (isSuccess) successCount++;
      else failedCount++;

      newLogs.push({
        id: generateId(),
        campaignId: '',  // Will be updated
        customerId: customer.id,
        customerName: customer.name,
        status,
        timestamp: new Date().toISOString(),
      });
    });

    // Create new campaign
    const newCampaign: Campaign = {
      ...campaign,
      id: generateId(),
      sentAt: new Date().toISOString(),
      totalSent: matchingCustomers.length,
      totalSuccess: successCount,
      totalFailed: failedCount,
      segmentName: segment.name,
    };

    // Update communication logs with campaign ID
    const updatedLogs = newLogs.map((log) => ({
      ...log,
      campaignId: newCampaign.id,
    }));

    setCampaigns((prev) => [...prev, newCampaign]);
    setCommunicationLogs((prev) => [...prev, ...updatedLogs]);

    return newCampaign;
  };

  const getCampaignById = (id: string) => {
    return campaigns.find((campaign) => campaign.id === id);
  };

  const getCampaignLogs = (campaignId: string) => {
    return communicationLogs.filter((log) => log.campaignId === campaignId);
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        orders,
        segments,
        campaigns,
        communicationLogs,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        addOrder,
        getOrdersByCustomerId,
        addSegment,
        previewSegment,
        addCampaign,
        getCampaignById,
        getCampaignLogs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};