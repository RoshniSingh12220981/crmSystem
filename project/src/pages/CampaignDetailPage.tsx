import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import { useData } from '../contexts/DataContext';
import { formatDate } from '../lib/utils';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCampaignById, getCampaignLogs } = useData();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const campaignData = getCampaignById(id);
      if (campaignData) {
        setCampaign(campaignData);
        
        const campaignLogs = getCampaignLogs(id);
        setLogs(campaignLogs);
      } else {
        // Campaign not found, redirect to history page
        navigate('/campaign-history');
      }
    }
  }, [id, getCampaignById, getCampaignLogs, navigate]);

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const columns = [
    {
      header: 'Customer',
      accessor: 'customerName',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <div className="flex items-center">
          {row.status === 'SENT' ? (
            <CheckCircle size={16} className="mr-2 text-success-500" />
          ) : (
            <XCircle size={16} className="mr-2 text-error-500" />
          )}
          <span className={`${
            row.status === 'SENT' ? 'text-success-700' : 'text-error-700'
          }`}>
            {row.status}
          </span>
        </div>
      ),
    },
    {
      header: 'Time',
      accessor: (row: any) => (
        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-gray-400" />
          <span>{new Date(row.timestamp).toLocaleTimeString()}</span>
        </div>
      ),
    },
  ];

  const successRate = (campaign.totalSuccess / campaign.totalSent) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/campaign-history')}
          leftIcon={<ArrowLeft size={16} />}
          className="mr-4"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-500 mt-1">Campaign details and delivery status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Sent Date</p>
                <div className="flex items-center mt-1">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <p className="text-gray-900">{formatDate(campaign.sentAt)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Target Segment</p>
                <div className="flex items-center mt-1">
                  <Users size={16} className="mr-2 text-gray-500" />
                  <p className="text-gray-900">{campaign.segmentName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Total Recipients</p>
                <div className="flex items-center mt-1">
                  <MessageCircle size={16} className="mr-2 text-gray-500" />
                  <p className="text-gray-900">{campaign.totalSent}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Success</p>
                <div className="flex items-center mt-1">
                  <div className="h-4 w-4 rounded-full mr-2 bg-success-500 flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <p className="text-gray-900">{successRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-900 whitespace-pre-line">{campaign.message}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Delivery Status</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-success-500 rounded-full" 
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-success-500 mr-1"></div>
                  <span>{campaign.totalSuccess} successful</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-error-500 mr-1"></div>
                  <span>{campaign.totalFailed} failed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Log</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={logs}
              columns={columns}
              emptyMessage="No delivery logs available for this campaign."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetailPage;