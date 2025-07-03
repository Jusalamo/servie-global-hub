
import React, { useState } from 'react';
import QuotationsList from './QuotationsList';
import CreateQuotationForm from './CreateQuotationForm';
import QuotationView from './QuotationView';
import { Quotation } from '@/services/quotationAPI';

type View = 'list' | 'create' | 'view' | 'edit';

export default function QuotationManager() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const handleCreateNew = () => {
    setCurrentView('create');
    setSelectedQuotation(null);
  };

  const handleEdit = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setCurrentView('edit');
  };

  const handleView = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setCurrentView('view');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedQuotation(null);
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedQuotation(null);
  };

  switch (currentView) {
    case 'create':
    case 'edit':
      return (
        <CreateQuotationForm
          onBack={handleBack}
          onSuccess={handleSuccess}
        />
      );
    
    case 'view':
      return selectedQuotation ? (
        <QuotationView
          quotationId={selectedQuotation.id}
          onBack={handleBack}
          onEdit={handleEdit}
        />
      ) : (
        <QuotationsList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
        />
      );
    
    default:
      return (
        <QuotationsList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
        />
      );
  }
}
