'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High BP Alert',
      description: 'Patient John Doe has abnormally high blood pressure (180/110)',
      timestamp: '2 minutes ago',
      patient: 'John Doe',
      service: 'Patient Service',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Service Degradation',
      description: 'Doctor Service response time increased',
      timestamp: '15 minutes ago',
      service: 'Doctor Service',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Patient Registration',
      description: 'New patient registered for Cardiology',
      timestamp: '1 hour ago',
      patient: 'Jane Smith',
      service: 'Patient Service',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts</h1>
          <p className="text-gray-600">
            Monitor system alerts and patient critical events
          </p>
        </div>

        {/* Alert Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">2</div>
              <p className="text-xs text-gray-500 mt-1">Require immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-gray-500 mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">8</div>
              <p className="text-xs text-gray-500 mt-1">General information</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Feed</CardTitle>
            <CardDescription>Recent system and patient alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.description}
                        </p>
                        {alert.patient && (
                          <p className="text-xs text-gray-500 mt-2">
                            👤 {alert.patient}
                          </p>
                        )}
                      </div>
                      <Badge className={getAlertBadgeColor(alert.type)}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>📦 {alert.service}</span>
                      <span>⏱️ {alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
