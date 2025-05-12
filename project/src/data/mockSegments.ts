import { Segment } from '../types';

export const mockSegments: Segment[] = [
  {
    id: 's1',
    name: 'High Spenders',
    rules: [
      {
        id: 'r1',
        field: 'totalSpend',
        operator: 'gt',
        value: 1000,
      },
    ],
    createdBy: '1',
    createdAt: '2023-09-15T10:30:00Z',
  },
  {
    id: 's2',
    name: 'Frequent Visitors',
    rules: [
      {
        id: 'r2',
        field: 'totalVisits',
        operator: 'gte',
        value: 10,
      },
    ],
    createdBy: '1',
    createdAt: '2023-10-02T14:20:00Z',
  },
  {
    id: 's3',
    name: 'New Customers',
    rules: [
      {
        id: 'r3',
        field: 'totalOrders',
        operator: 'lte',
        value: 2,
      },
    ],
    createdBy: '1',
    createdAt: '2023-10-20T09:15:00Z',
  },
];