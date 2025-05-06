
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  CreditCard,
  Trash2,
  PlusCircle,
  Check,
  X,
  Pencil,
  AlertCircle,
  Loader2,
  Download,
  File,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PaymentCard {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  invoice?: string;
}

// Mock payment cards
const mockPaymentCards: PaymentCard[] = [
  {
    id: 'card-1',
    cardType: 'visa',
    lastFour: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    cardholderName: 'John Doe',
    isDefault: true,
    billingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States'
    }
  },
  {
    id: 'card-2',
    cardType: 'mastercard',
    lastFour: '5678',
    expiryMonth: '03',
    expiryYear: '2026',
    cardholderName: 'John Doe',
    isDefault: false
  }
];

// Mock transaction history
const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    date: '2023-05-15',
    description: 'Home Cleaning Service',
    amount: 85.00,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
    invoice: 'INV-001'
  },
  {
    id: 'txn-2',
    date: '2023-04-30',
    description: 'Monthly Subscription',
    amount: 19.99,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
    invoice: 'INV-002'
  },
  {
    id: 'txn-3',
    date: '2023-04-22',
    description: 'Plumbing Repair',
    amount: 150.00,
    status: 'refunded',
    paymentMethod: 'Mastercard ending in 5678',
    invoice: 'INV-003'
  },
  {
    id: 'txn-4',
    date: '2023-04-15',
    description: 'Monthly Subscription',
    amount: 19.99,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
    invoice: 'INV-004'
  },
  {
    id: 'txn-5',
    date: '2023-03-28',
    description: 'Lawn Mowing Service',
    amount: 45.00,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
    invoice: 'INV-005'
  }
];

// Card type logos
const cardLogos: Record<string, string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png',
  discover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Discover_Card_logo.svg/1280px-Discover_Card_logo.svg.png'
};

const PaymentMethods = () => {
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [addingCard, setAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<'paymentDetails' | 'billingAddress'>('paymentDetails');
  
  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    }
  });
  
  const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | undefined => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^6(?:011|5)/;
    
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (visaRegex.test(cleanNumber)) return 'visa';
    if (mastercardRegex.test(cleanNumber)) return 'mastercard';
    if (amexRegex.test(cleanNumber)) return 'amex';
    if (discoverRegex.test(cleanNumber)) return 'discover';
    
    return undefined;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewCard(prev => {
        // Fix for the spread operator issue
        if (parent === 'billingAddress') {
          return {
            ...prev,
            billingAddress: {
              ...prev.billingAddress,
              [child]: value
            }
          };
        }
        // Handle other nested objects if they exist
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
            [child]: value
          }
        };
      });
    } else {
      setNewCard(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!newCard.cardNumber || !newCard.cardholderName || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      toast.error('Please fill out all required fields');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const cardType = detectCardType(newCard.cardNumber) || 'visa';
      const lastFour = newCard.cardNumber.slice(-4);
      
      const newPaymentCard: PaymentCard = {
        id: `card-${Date.now()}`,
        cardType,
        lastFour,
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        cardholderName: newCard.cardholderName,
        isDefault: newCard.isDefault,
        billingAddress: newCard.billingAddress
      };
      
      // If this is set as default, update other cards
      if (newCard.isDefault) {
        setPaymentCards(prev => 
          prev.map(card => ({
            ...card,
            isDefault: false
          }))
        );
      }
      
      setPaymentCards(prev => [...prev, newPaymentCard]);
      setAddingCard(false);
      setLoading(false);
      toast.success('Payment method added successfully!');
      
      // Reset form
      setNewCard({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false,
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'United States'
        }
      });
    }, 1500);
  };
  
  const handleSetDefault = (cardId: string) => {
    setPaymentCards(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    toast.success('Default payment method updated');
  };
  
  const handleDeleteCard = (cardId: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentCards(prev => prev.filter(card => card.id !== cardId));
      setLoading(false);
      setDeleteCardId(null);
      toast.success('Payment method removed successfully');
    }, 1000);
  };
  
  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-blue-600';
      default:
        return '';
    }
  };
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Payment Cards */}
            {paymentCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentCards.map((card) => (
                  <div 
                    key={card.id}
                    className={`border rounded-lg p-4 relative ${
                      card.isDefault ? 'border-servie/40 bg-servie/5' : ''
                    }`}
                  >
                    {card.isDefault && (
                      <span className="absolute top-2 right-2 bg-servie text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <img 
                        src={cardLogos[card.cardType]} 
                        alt={card.cardType} 
                        className="h-8 object-contain"
                      />
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingCardId(card.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteCardId(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <div className="text-lg font-mono">
                        •••• •••• •••• {card.lastFour}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {card.expiryMonth}/{card.expiryYear}
                      </div>
                      <div className="font-medium">
                        {card.cardholderName}
                      </div>
                    </div>
                    
                    {!card.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(card.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    
                    {/* Delete confirmation dialog */}
                    <Dialog open={deleteCardId === card.id} onOpenChange={(open) => !open && setDeleteCardId(null)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove Payment Method</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove this payment method? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 border rounded-md bg-muted/50 space-y-1">
                          <div className="font-medium">
                            {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} ending in {card.lastFour}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expires {card.expiryMonth}/{card.expiryYear}
                          </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button variant="outline" onClick={() => setDeleteCardId(null)}>
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDeleteCard(card.id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              'Remove Payment Method'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">No payment methods</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't added any payment methods yet.
                </p>
              </div>
            )}
            
            {/* Add Payment Method button */}
            {!addingCard && (
              <Button 
                onClick={() => setAddingCard(true)} 
                className="gap-1 bg-servie hover:bg-servie-600"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Payment Method
              </Button>
            )}
            
            {/* Add Payment Method form */}
            {addingCard && (
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Add Payment Method</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex border-b mb-4 space-x-4">
                    <button
                      className={`pb-2 px-1 font-medium text-sm ${
                        formTab === 'paymentDetails' 
                          ? 'border-b-2 border-servie text-servie' 
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setFormTab('paymentDetails')}
                    >
                      Payment Details
                    </button>
                    <button
                      className={`pb-2 px-1 font-medium text-sm ${
                        formTab === 'billingAddress' 
                          ? 'border-b-2 border-servie text-servie' 
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setFormTab('billingAddress')}
                    >
                      Billing Address
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {formTab === 'paymentDetails' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formatCardNumber(newCard.cardNumber)}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            name="cardholderName"
                            value={newCard.cardholderName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Expiration Date</Label>
                            <div className="flex gap-2">
                              <Select
                                value={newCard.expiryMonth}
                                onValueChange={(value) => setNewCard({...newCard, expiryMonth: value})}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map(month => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <Select
                                value={newCard.expiryYear}
                                onValueChange={(value) => setNewCard({...newCard, expiryYear: value})}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="YYYY" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map(year => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={newCard.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={4}
                              required
                              type="password"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="isDefault"
                            checked={newCard.isDefault}
                            onCheckedChange={(checked) => 
                              setNewCard({...newCard, isDefault: checked as boolean})
                            }
                          />
                          <Label htmlFor="isDefault">Set as default payment method</Label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddress.street">Street Address</Label>
                          <Input
                            id="billingAddress.street"
                            name="billingAddress.street"
                            value={newCard.billingAddress.street}
                            onChange={handleInputChange}
                            placeholder="123 Main St"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress.city">City</Label>
                            <Input
                              id="billingAddress.city"
                              name="billingAddress.city"
                              value={newCard.billingAddress.city}
                              onChange={handleInputChange}
                              placeholder="Anytown"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress.state">State</Label>
                            <Input
                              id="billingAddress.state"
                              name="billingAddress.state"
                              value={newCard.billingAddress.state}
                              onChange={handleInputChange}
                              placeholder="CA"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress.zip">ZIP Code</Label>
                            <Input
                              id="billingAddress.zip"
                              name="billingAddress.zip"
                              value={newCard.billingAddress.zip}
                              onChange={handleInputChange}
                              placeholder="12345"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress.country">Country</Label>
                            <Select
                              value={newCard.billingAddress.country}
                              onValueChange={(value) => setNewCard({
                                ...newCard,
                                billingAddress: {
                                  ...newCard.billingAddress,
                                  country: value
                                }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="South Africa">South Africa</SelectItem>
                                <SelectItem value="Ghana">Ghana</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setAddingCard(false);
                          setNewCard({
                            cardNumber: '',
                            cardholderName: '',
                            expiryMonth: '',
                            expiryYear: '',
                            cvv: '',
                            isDefault: false,
                            billingAddress: {
                              street: '',
                              city: '',
                              state: '',
                              zip: '',
                              country: 'United States'
                            }
                          });
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      
                      {formTab === 'paymentDetails' ? (
                        <Button 
                          type="button" 
                          className="bg-servie hover:bg-servie-600"
                          onClick={() => setFormTab('billingAddress')}
                        >
                          Continue
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setFormTab('paymentDetails')}
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-servie hover:bg-servie-600"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Save Card
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            <div className="text-xs text-muted-foreground flex items-center mt-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              Your payment information is encrypted and secure
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            View your payment history and transaction details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        {transaction.invoice && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 flex items-center justify-center"
                          >
                            <span className="sr-only">Download invoice</span>
                            <File className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">No transaction history</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any payments yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;
