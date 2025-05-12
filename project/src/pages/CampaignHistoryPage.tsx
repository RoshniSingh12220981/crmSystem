import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { formatDate } from '../lib/utils';

const CampaignHistoryPage: React.FC = () => {
  const { campaigns } = useData();
  const navigate = useNavigate();

  const columns = [
    {
      header: 'Campaign Name',
      accessor: 'name',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Sent At',
      accessor: (row: any) => (
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(row.sentAt)}</span>
        </div>
      ),
    },
    {
      header: 'Segment',
      accessor: (row: any) => (
        <div className="flex items-center">
          <Users size={16} className="mr-2 text-gray-400" />
          <span>{row.segmentName}</span>
        </div>
      ),
    },
    {
      header: 'Total Sent',
      accessor: (row: any) => (
        <div className="flex items-center">
          <MessageCircle size={16} className="mr-2 text-gray-400" />
          <span>{row.totalSent}</span>
        </div>
      ),
    },
    {
      header: 'Delivery Rate',
      accessor: (row: any) => {
        const deliveryRate = row.totalSent ? (row.totalSuccess / row.totalSent) * 100 : 0;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  deliveryRate >= 90 ? 'bg-success-500' : 
                  deliveryRate >= 75 ? 'bg-warning-500' : 
                  'bg-error-500'
                }`}
                style={{ width: `${deliveryRate}%` }}
              ></div>
            </div>
            <span>{deliveryRate.toFixed(0)}%</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: (row: any) => {
        const successCount = row.totalSuccess;
        const failedCount = row.totalFailed;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <CheckCircle size={16} className="mr-1 text-success-500" />
              <span className="text-success-700">{successCount}</span>
            </div>
            <div className="flex items-center">
              <XCircle size={16} className="mr-1 text-error-500" />
              <span className="text-error-700">{failedCount}</span>
            </div>
          </div>
        );
      }
    },
  ];

  const sortedCampaigns = [...campaigns].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign History</h1>
        <p className="text-gray-500 mt-1">View and analyze past campaign performance</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          data={sortedCampaigns}
          columns={columns}
          onRowClick={(campaign) => navigate(`/campaign-history/${campaign.id}`)}
          emptyMessage="No campaigns have been sent yet. Create a new campaign to get started."
        />
      </div>
    </div>
  );
};

export default CampaignHistoryPage;