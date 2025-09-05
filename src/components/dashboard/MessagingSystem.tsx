import React from 'react';
import RealTimeMessaging from '@/components/messaging/RealTimeMessaging';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessagingSystemProps {
  userRole?: string;
}

export default function MessagingSystem({ userRole = 'provider' }: MessagingSystemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messaging System</CardTitle>
      </CardHeader>
      <CardContent>
        <RealTimeMessaging userRole={userRole} />
      </CardContent>
    </Card>
  );
}