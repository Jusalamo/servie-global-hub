
import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useMockAuth } from '@/context/MockAuthContext';
import { TestTube } from 'lucide-react';

export default function MockAuthToggle() {
  const { mockMode, toggleMockMode, user, signOut } = useMockAuth();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center space-x-2">
        <TestTube className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="mock-mode" className="text-sm">
          Mock Mode
        </Label>
        <Switch
          id="mock-mode"
          checked={mockMode}
          onCheckedChange={toggleMockMode}
        />
      </div>
      
      {mockMode && user && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="text-xs"
        >
          Sign Out ({user.name})
        </Button>
      )}
    </div>
  );
}
