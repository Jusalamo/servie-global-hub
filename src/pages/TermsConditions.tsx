
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import EnhancedFooter from "@/components/EnhancedFooter";

const TermsConditions = () => {
  const [accepted, setAccepted] = useState(false);
  
  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 15, 2025</p>
        
        <div className="prose dark:prose-invert max-w-none mb-10">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Servie ("Company", "we", "our", "us"). These Terms and Conditions 
              ("Terms", "Terms and Conditions") govern your use of our website 
              and services operated by Servie.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you 
              disagree with any part of the terms, then you may not access the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. Failure to do so constitutes a breach of the 
              Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password you use to access the Service and 
              for any activities or actions under your password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us 
              immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Roles and Responsibilities</h2>
            <h3 className="text-xl font-medium mb-2">3.1 Clients</h3>
            <p>
              As a client user, you are responsible for accurately describing your service needs, 
              communicating clearly with service providers, and fulfilling payment obligations in a 
              timely manner for services rendered.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.2 Service Providers</h3>
            <p>
              As a service provider, you are responsible for accurately representing your qualifications, 
              skills, and services offered. You must perform services in a professional manner, maintain 
              communication with clients, and honor commitments made through our platform.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">3.3 Sellers</h3>
            <p>
              As a seller, you are responsible for accurately describing products, maintaining appropriate 
              inventory, shipping products in a timely manner, and handling returns or complaints according 
              to our platform policies.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Fees and Payments</h2>
            <p>
              Servie charges fees for transactions completed on our platform. These fees vary depending 
              on the type of service or product, and user role.
            </p>
            <p>
              Service providers and sellers agree to pay platform commission fees on completed transactions. 
              Clients agree to pay the full price for services or products as listed on the platform.
            </p>
            <p>
              All payments processed through our platform are subject to our Payment Policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the 
              exclusive property of Servie and its licensors.
            </p>
            <p>
              Users retain rights to content they submit, post, or display on our platform, but grant 
              Servie a license to use, modify, publicly perform, publicly display, reproduce, and 
              distribute such content on our platform.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to 
              terminate your account, you may simply discontinue using the Service or contact us to 
              request account deletion.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall Servie, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential or 
              punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of or inability to 
              access or use the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws, without regard 
              to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a 
              waiver of those rights. If any provision of these Terms is held to be invalid or 
              unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material we will try to provide at least 30 days' notice prior to any new 
              terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree 
              to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">support@servie-global.com</p>
          </section>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="terms" 
            checked={accepted} 
            onCheckedChange={(checked) => setAccepted(!!checked)} 
          />
          <label 
            htmlFor="terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the Terms and Conditions
          </label>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            asChild
          >
            <Link to="/signup">Back to Sign Up</Link>
          </Button>
          <Button 
            disabled={!accepted}
          >
            Continue
          </Button>
        </div>
      </div>
      <EnhancedFooter />
    </>
  );
};

export default TermsConditions;
