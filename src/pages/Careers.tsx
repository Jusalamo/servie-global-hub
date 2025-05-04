
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPin, Clock, Send, Search } from "lucide-react";

const careers = [
  {
    id: "job1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Lagos, Nigeria (Remote)",
    type: "Full-time",
    description: "We're looking for an experienced Frontend Developer to join our team and help build the next generation of our platform. You'll work on creating intuitive and responsive user interfaces that power the Servie experience.",
    responsibilities: [
      "Implement responsive user interfaces using React and TypeScript",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable code with proper documentation",
      "Participate in code reviews and mentor junior developers",
      "Optimize applications for maximum performance"
    ],
    requirements: [
      "4+ years of experience in frontend development",
      "Strong proficiency in React, TypeScript, and modern CSS",
      "Experience with responsive design and cross-browser compatibility",
      "Knowledge of state management (Redux, Context API, etc.)",
      "Experience with testing frameworks (Jest, React Testing Library, etc.)"
    ]
  },
  {
    id: "job2",
    title: "Product Manager",
    department: "Product",
    location: "Nairobi, Kenya (Hybrid)",
    type: "Full-time",
    description: "As a Product Manager at Servie, you'll be responsible for driving the vision, strategy, and roadmap for our service provider features. You'll work closely with engineering, design, and business teams to deliver products that delight our users.",
    responsibilities: [
      "Define and communicate product vision and strategy",
      "Gather and prioritize product requirements",
      "Work with design and engineering teams to deliver features",
      "Analyze user feedback and market research to inform product decisions",
      "Track and measure product performance metrics"
    ],
    requirements: [
      "3+ years of product management experience",
      "Experience with marketplace or service platforms",
      "Strong analytical and problem-solving skills",
      "Excellent communication and stakeholder management abilities",
      "Data-driven approach to decision making"
    ]
  },
  {
    id: "job3",
    title: "Customer Support Specialist",
    department: "Operations",
    location: "Multiple Locations (Remote)",
    type: "Full-time",
    description: "Join our customer support team to help service providers and clients have a seamless experience on Servie. You'll be the voice of our company, ensuring our users get the assistance they need when they need it.",
    responsibilities: [
      "Respond to user inquiries via chat, email, and phone",
      "Troubleshoot and resolve user issues",
      "Document common problems and contribute to knowledge base",
      "Collect and share user feedback with product and engineering teams",
      "Maintain high customer satisfaction ratings"
    ],
    requirements: [
      "1+ years of customer support experience",
      "Excellent communication skills in English (additional languages are a plus)",
      "Problem-solving mindset",
      "Ability to work in a fast-paced environment",
      "Tech-savvy with ability to troubleshoot basic technical issues"
    ]
  },
  {
    id: "job4",
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Accra, Ghana",
    type: "Full-time",
    description: "We're looking for a Marketing Coordinator to help grow Servie's brand presence and user base across Africa. You'll work on campaigns to attract both service providers and clients to our platform.",
    responsibilities: [
      "Execute marketing campaigns across digital channels",
      "Create and manage content for social media platforms",
      "Coordinate with external agencies and partners",
      "Track campaign performance and provide regular reports",
      "Support local marketing initiatives"
    ],
    requirements: [
      "2+ years of marketing experience",
      "Strong digital marketing skills",
      "Experience with social media management tools",
      "Data analysis abilities",
      "Creative thinking and excellent organizational skills"
    ]
  }
];

const internships = [
  {
    id: "intern1",
    title: "Software Engineering Intern",
    department: "Engineering",
    location: "Remote",
    description: "Learn and contribute to our product development under the guidance of senior engineers."
  },
  {
    id: "intern2",
    title: "Marketing Intern",
    department: "Marketing",
    location: "Lagos, Nigeria",
    description: "Gain hands-on experience in digital marketing and campaigns for a growing tech platform."
  }
];

const Careers = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredCareers = careers.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredInternships = internships.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-servie to-purple-600 text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Join Our Team</h1>
              <p className="text-lg md:text-xl opacity-90">
                Help us build the future of service delivery across Africa
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Work at Servie?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join a team that's passionate about empowering service providers and transforming how services are discovered and delivered.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-servie/10 flex items-center justify-center mb-4">
                        <Briefcase className="h-6 w-6 text-servie" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Meaningful Work</h3>
                      <p className="text-muted-foreground text-sm">
                        Make a real difference in people's lives by connecting them with essential services.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-servie/10 flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-servie" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Growth & Learning</h3>
                      <p className="text-muted-foreground text-sm">
                        Continuous learning opportunities and career growth in a rapidly expanding company.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-servie/10 flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-servie" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Inclusive Culture</h3>
                      <p className="text-muted-foreground text-sm">
                        Be part of a diverse team where everyone's voice is heard and valued.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for job openings..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="full-time" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="full-time">Full-Time Positions</TabsTrigger>
                  <TabsTrigger value="internships">Internships</TabsTrigger>
                </TabsList>
                <TabsContent value="full-time">
                  <div className="space-y-4 mt-6">
                    {filteredCareers.length > 0 ? (
                      filteredCareers.map((job) => (
                        <div key={job.id} className="border rounded-lg p-6 hover:border-servie hover:shadow-sm transition-all">
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                          </div>
                          <p className="mb-4">{job.description}</p>
                          <Button className="bg-servie hover:bg-servie-600">
                            <Send className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p>No positions match your search. Try adjusting your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="internships">
                  <div className="space-y-4 mt-6">
                    {filteredInternships.length > 0 ? (
                      filteredInternships.map((job) => (
                        <div key={job.id} className="border rounded-lg p-6 hover:border-servie hover:shadow-sm transition-all">
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                          </div>
                          <p className="mb-4">{job.description}</p>
                          <Button className="bg-servie hover:bg-servie-600">
                            <Send className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p>No internships match your search. Try adjusting your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="border rounded-lg p-6 bg-muted/50 text-center">
                <h3 className="text-lg font-semibold mb-2">Don't see a role that fits?</h3>
                <p className="mb-4">We're always looking for talented individuals to join our team.</p>
                <Button variant="outline">
                  Submit an Open Application
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
