
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: May 1, 2024
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="prose max-w-none">
                <h2>Introduction</h2>
                <p>
                  At Servie, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, and it will tell you about your privacy rights and how the law protects you.
                </p>
                <p>
                  Please read this privacy policy carefully before using our platform. By using Servie, you're agreeing to the collection and use of information in accordance with this policy.
                </p>
                
                <h2>Information We Collect</h2>
                <p>We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:</p>
                <ul>
                  <li><strong>Identity Data</strong>: includes first name, last name, username or similar identifier, and profile picture.</li>
                  <li><strong>Contact Data</strong>: includes email address, telephone numbers, billing address, and delivery address.</li>
                  <li><strong>Financial Data</strong>: includes payment card details and transaction history.</li>
                  <li><strong>Technical Data</strong>: includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li><strong>Usage Data</strong>: includes information about how you use our website, products, and services.</li>
                  <li><strong>Location Data</strong>: includes your current location disclosed by GPS technology or derived from your IP address.</li>
                </ul>
                
                <h2>How We Collect Your Data</h2>
                <p>We use different methods to collect data from and about you, including through:</p>
                <ul>
                  <li>Direct interactions: You may give us your identity, contact, and financial data by filling in forms or by corresponding with us.</li>
                  <li>Automated technologies: As you interact with our website, we automatically collect Technical Data about your browsing actions and patterns.</li>
                  <li>Third parties: We may receive personal data about you from various third parties, such as analytics providers, advertising networks, and search information providers.</li>
                </ul>
                
                <h2>How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                  <li>To register you as a new customer or service provider.</li>
                  <li>To process and deliver your orders or services.</li>
                  <li>To manage our relationship with you.</li>
                  <li>To improve our website, products/services, marketing, and customer relationships.</li>
                  <li>To recommend products or services that may interest you.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
                
                <h2>Data Security</h2>
                <p>
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                </p>
                <p>
                  We have procedures in place to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
                </p>
                
                <h2>Data Retention</h2>
                <p>
                  We will only retain your personal data for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
                
                <h2>Your Legal Rights</h2>
                <p>Under data protection laws, you have rights in relation to your personal data, including the right to:</p>
                <ul>
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request restriction of processing your personal data.</li>
                  <li>Request transfer of your personal data.</li>
                  <li>Right to withdraw consent.</li>
                </ul>
                <p>
                  You will not have to pay a fee to access your personal data or to exercise any of the other rights. However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
                </p>
                
                <h2>Cookies</h2>
                <p>
                  Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use and the purposes for which we use them, see our Cookie Policy.
                </p>
                
                <h2>Third-Party Links</h2>
                <p>
                  This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                </p>
                
                <h2>Changes to Our Privacy Policy</h2>
                <p>
                  We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date at the top of this page. You are advised to review this privacy policy periodically for any changes.
                </p>
                
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy or our privacy practices, please contact us:
                </p>
                <ul>
                  <li>By email: privacy@servie.com</li>
                  <li>By mail: Servie Privacy Team, 123 Tech Street, Lagos, Nigeria</li>
                </ul>
                <p>
                  You have the right to make a complaint at any time to your local data protection authority. However, we would appreciate the chance to deal with your concerns before you approach the authority, so please contact us in the first instance.
                </p>
                
                <div className="mt-10 border-t pt-6">
                  <p>
                    <strong>Related Policies:</strong>{" "}
                    <Link to="/terms" className="text-servie hover:underline">Terms of Service</Link>{" "}
                    <span className="mx-2">•</span>{" "}
                    <Link to="/cookie-policy" className="text-servie hover:underline">Cookie Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
