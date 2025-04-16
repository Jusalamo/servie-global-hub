
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  ExternalLink, 
  Check, 
  Clipboard, 
  Terminal, 
  Monitor, 
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface DeploymentGuideProps {
  className?: string;
}

const DeploymentGuide = ({ className }: DeploymentGuideProps) => {
  const [selectedTab, setSelectedTab] = useState('github');
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <Card className={`enhanced-card ${className || ''}`}>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Deployment Guide</h2>
        
        <div className="flex border-b">
          <button 
            onClick={() => setSelectedTab('github')}
            className={`pb-2 px-4 ${selectedTab === 'github' 
              ? 'border-b-2 border-servie text-servie' 
              : 'text-muted-foreground'} font-medium`}
          >
            Github
          </button>
          <button 
            onClick={() => setSelectedTab('vercel')}
            className={`pb-2 px-4 ${selectedTab === 'vercel' 
              ? 'border-b-2 border-servie text-servie' 
              : 'text-muted-foreground'} font-medium`}
          >
            Vercel
          </button>
          <button 
            onClick={() => setSelectedTab('supabase')}
            className={`pb-2 px-4 ${selectedTab === 'supabase' 
              ? 'border-b-2 border-servie text-servie' 
              : 'text-muted-foreground'} font-medium`}
          >
            Supabase
          </button>
        </div>
        
        <div className="space-y-6">
          {selectedTab === 'github' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Github className="mr-2 h-5 w-5" />
                  Export to GitHub
                </h3>
                <p className="text-muted-foreground">
                  First, you need to export your project to a GitHub repository.
                </p>
                <ol className="space-y-4 list-decimal ml-5">
                  <li>
                    <p>Click the <strong>Export to GitHub</strong> button on the Lovable interface</p>
                  </li>
                  <li>
                    <p>Connect your GitHub account if not already connected</p>
                  </li>
                  <li>
                    <p>Name your repository and click "Export"</p>
                  </li>
                </ol>
                
                <h4 className="font-medium mt-4">Clone your repository locally</h4>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm relative">
                  git clone https://github.com/yourusername/your-repo.git
                  <button 
                    onClick={() => copyToClipboard('git clone https://github.com/yourusername/your-repo.git', 'Command copied!')}
                    className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-gray-200 text-muted-foreground"
                    aria-label="Copy to clipboard"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
                
                <h4 className="font-medium mt-4">Install dependencies and run locally</h4>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm relative">
                  cd your-repo<br />
                  npm install<br />
                  npm run dev
                  <button 
                    onClick={() => copyToClipboard('cd your-repo\nnpm install\nnpm run dev', 'Commands copied!')}
                    className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-gray-200 text-muted-foreground"
                    aria-label="Copy to clipboard"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    className="flex items-center"
                    onClick={() => window.open('https://github.com/new', '_blank')}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Create New Repository
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {selectedTab === 'vercel' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Monitor className="mr-2 h-5 w-5" />
                  Deploy to Vercel
                </h3>
                <p className="text-muted-foreground">
                  After exporting to GitHub, you can deploy your app to Vercel in a few steps.
                </p>
                
                <ol className="space-y-4 list-decimal ml-5">
                  <li>
                    <p>Sign up for a <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="text-servie hover:underline">Vercel account</a> if you don't have one</p>
                  </li>
                  <li>
                    <p>Click "New Project" on the Vercel dashboard</p>
                  </li>
                  <li>
                    <p>Import your GitHub repository</p>
                  </li>
                  <li>
                    <p>Configure environment variables (if needed)</p>
                  </li>
                  <li>
                    <p>Click "Deploy"</p>
                  </li>
                </ol>
                
                <div className="bg-gray-800 text-white p-4 rounded-md mt-4">
                  <p className="text-sm mb-2 text-gray-300">Set these environment variables for production:</p>
                  <div className="font-mono text-xs space-y-1">
                    <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
                    <p>VITE_SUPABASE_ANON_KEY=your-anon-key</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    className="flex items-center"
                    onClick={() => window.open('https://vercel.com/new', '_blank')}
                  >
                    <span className="mr-2 font-bold">▲</span>
                    Deploy to Vercel
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-3 mt-6">
                  <div className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      Your site will be live at <strong>https://your-project.vercel.app</strong> after deployment!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {selectedTab === 'supabase' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Connect to Supabase
                </h3>
                <p className="text-muted-foreground">
                  Ensure your Supabase environment is properly configured for production.
                </p>
                
                <ol className="space-y-4 list-decimal ml-5">
                  <li>
                    <p>Verify that auth settings are correctly configured in the Supabase dashboard</p>
                  </li>
                  <li>
                    <p>Ensure your database tables have the proper RLS (Row Level Security) policies</p>
                  </li>
                  <li>
                    <p>Add your production domain to the allowed origins in Auth Settings</p>
                  </li>
                </ol>
                
                <div className="bg-gray-100 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">Required SQL Schema Setup:</h4>
                  <div className="font-mono text-xs">
                    <pre className="whitespace-pre-wrap">
{`-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('client', 'provider', 'seller')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Set up RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);`}
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    className="flex items-center"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <Terminal className="mr-2 h-4 w-4" />
                    Go to Supabase Dashboard
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeploymentGuide;
