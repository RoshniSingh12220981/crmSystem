import { Campaign } from '../types';

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp1',
    name: 'Summer Sale Promotion',
    segmentId: 's1',
    segmentName: 'High Spenders',
    message: 'Exclusive summer sale for our valued customers! Use code SUMMER25 for 25% off your next purchase.',
    sentAt: '2023-06-05T09:30:00Z',
    totalSent: 3,
    totalSuccess: 3,
    totalFailed: 0,
  },
  {
    id: 'camp2',
    name: 'Loyalty Reward',
    segmentId: 's2',
    segmentName: 'Frequent Visitors',
    message: 'Thank you for your continued support! Enjoy a free gift with your next purchase using code LOYALTY.',
    sentAt: '2023-07-12T14:15:00Z',
    totalSent: 2,
    totalSuccess: 1,
    totalFailed: 1,
  },
  {
    id: 'camp3',
    name: 'Welcome Discount',
    segmentId: 's3',
    segmentName: 'New Customers',
    message: 'Welcome to our family! Enjoy 15% off your next order with code WELCOME15.',
    sentAt: '2023-08-20T11:45:00Z',
    totalSent: 2,
    totalSuccess: 2,
    totalFailed: 0,
  },
];