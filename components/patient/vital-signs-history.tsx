'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VitalSignsReview {
  id: number;
  patientId: number;
  vitalSignsId: number;
  doctorId: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  weight: number;
  height: number;
  recordedAt: string;
  doctorNotes: string | null;
  isReviewed: boolean;
  reviewedAt: string | null;
}

export function PatientVitalSignsHistory({ patientId }: { patientId: number }) {
  const [history, setHistory] = useState<VitalSignsReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/vital-signs-review/patient/${patientId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Sort by newest first
          setHistory(data.sort((a: VitalSignsReview, b: VitalSignsReview) => 
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
          ));
        }
      } catch (error) {
        console.error('Error fetching vital signs history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchHistory();
      // Auto refresh every 10 seconds to check for new doctor notes
      const interval = setInterval(fetchHistory, 10000);
      return () => clearInterval(interval);
    }
  }, [patientId]);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading your history...</div>;
  }

  if (history.length === 0) {
    return null; // Don't show anything if no history yet
  }

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Your History & Doctor Responses</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {history.map((record) => (
          <Card key={record.id} className={`shadow-sm ${record.isReviewed ? 'border-indigo-100 bg-indigo-50/10' : 'border-gray-100'}`}>
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-md">
                    {new Date(record.recordedAt).toLocaleDateString()} at {new Date(record.recordedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </CardTitle>
                </div>
                {record.isReviewed ? (
                  <Badge className="bg-indigo-100 text-indigo-800 border-none">Reviewed by Doctor</Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Pending Review</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div><span className="font-semibold">Blood Pressure:</span> {record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg</div>
                <div><span className="font-semibold">Heart Rate:</span> {record.heartRate} bpm</div>
                <div><span className="font-semibold">Temperature:</span> {record.temperature}°C</div>
                {record.respiratoryRate && <div><span className="font-semibold">Resp. Rate:</span> {record.respiratoryRate}/min</div>}
                {record.weight && <div><span className="font-semibold">Weight:</span> {record.weight} kg</div>}
                {record.height && <div><span className="font-semibold">Height:</span> {record.height} cm</div>}
              </div>

              {record.isReviewed && record.doctorNotes && (
                <div className="mt-4 p-3 bg-white border border-indigo-100 rounded-md">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Doctor's Note</p>
                  <p className="text-sm text-gray-800 italic">"{record.doctorNotes}"</p>
                  {record.reviewedAt && (
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      Reviewed on {new Date(record.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
