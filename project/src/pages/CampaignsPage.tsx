import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useData } from '../contexts/DataContext';
import { Customer } from '../types';

const CampaignsPage: React.FC = () => {
  const { segments, addCampaign, previewSegment } = useData();
  const [segmentId, setSegmentId] = useState('');
  const [message, setMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [previewCustomers, setPreviewCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSegmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSegmentId = e.target.value;
    setSegmentId(selectedSegmentId);
    
    if (selectedSegmentId) {
      const segment = segments.find(s => s.id === selectedSegmentId);
      if (segment) {
        const matchingCustomers = await previewSegment(segment.rules);
        setPreviewCustomers(matchingCustomers);
      }
    } else {
      setPreviewCustomers([]);
    }
  };

  const handleSendCampaign = async () => {
    if (!segmentId || !message || !campaignName) return;
    
    setIsLoading(true);
    
    try {
      const campaign = await addCampaign({
        name: campaignName,
        segmentId,
        message,
      });
      
      setIsSuccess(true);
      setSuccessMessage(`Campaign "${campaignName}" was sent successfully to ${campaign.totalSent} customers with ${campaign.totalSuccess} successful deliveries.`);
      
      // Reset form
      setCampaignName('');
      setSegmentId('');
      setMessage('');
      setPreviewCustomers([]);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setSuccessMessage('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
        <p className="text-gray-500 mt-1">Send targeted messages to specific customer segments</p>
      </div>

      {isSuccess && (
        <div className="bg-success-100 text-success-800 p-4 rounded-md animate-fade-in">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Campaign Name"
            placeholder="e.g., Summer Sale Announcement"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label htmlFor="segment" className="block text-sm font-medium text-gray-700">
              Target Segment *
            </label>
            <select
              id="segment"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={segmentId}
              onChange={handleSegmentChange}
              required
            >
              <option value="">Select a segment</option>
              {segments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message *
            </label>
            <textarea
              id="message"
              rows={5}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter your message content here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {previewCustomers.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Campaign Preview
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                This campaign will be sent to {previewCustomers.length} customers in the selected segment.
              </p>
              <div className="flex flex-wrap gap-2">
                {previewCustomers.slice(0, 5).map((customer) => (
                  <span
                    key={customer.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {customer.name}
                  </span>
                ))}
                {previewCustomers.length > 5 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{previewCustomers.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {segmentId && previewCustomers.length === 0 && (
            <div className="p-3 bg-warning-50 rounded-md border border-warning-200 flex items-start">
              <AlertCircle size={16} className="text-warning-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-warning-700">
                No customers match the selected segment criteria. Your campaign won't be sent to anyone.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            leftIcon={<Send size={16} />}
            onClick={handleSendCampaign}
            isLoading={isLoading}
            disabled={!segmentId || !message || !campaignName || previewCustomers.length === 0}
          >
            Send Campaign
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CampaignsPage;