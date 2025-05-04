
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Twitter, Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "David Okonkwo",
    role: "Founder & CEO",
    bio: "David founded Servie with a vision to transform how services are discovered and delivered across Africa. With a background in technology and business development, he leads the company's strategic direction.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "david@servie.com"
    }
  },
  {
    name: "Amara Nwosu",
    role: "Chief Operating Officer",
    bio: "Amara oversees Servie's day-to-day operations, ensuring the platform delivers exceptional experiences for both service providers and clients. She brings extensive experience in operations management and customer success.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "amara@servie.com"
    }
  },
  {
    name: "Kwame Adjei",
    role: "Chief Technology Officer",
    bio: "Kwame leads Servie's technology team, architecting solutions that make the platform accessible across diverse technological environments. His expertise in software development drives our innovation roadmap.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "kwame@servie.com"
    }
  },
  {
    name: "Fatima Hassan",
    role: "Head of Marketing",
    bio: "Fatima drives Servie's marketing strategy, focusing on growing our community of service providers and clients. Her background in digital marketing and community building has been instrumental in Servie's growth.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "fatima@servie.com"
    }
  },
  {
    name: "Samuel Osei",
    role: "Head of Provider Relations",
    bio: "Samuel ensures that service providers on our platform have the tools, support, and opportunities they need to succeed. His background in business development and customer success guides our provider strategy.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "samuel@servie.com"
    }
  },
  {
    name: "Nala Diop",
    role: "Head of Customer Experience",
    bio: "Nala leads Servie's customer support team, ensuring clients have seamless, positive experiences on our platform. Her focus on customer satisfaction has helped maintain Servie's high service standards.",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    social: {
      twitter: "#",
      linkedin: "#",
      email: "nala@servie.com"
    }
  }
];

const advisors = [
  {
    name: "Dr. Ngozi Okafor",
    role: "Technology & Innovation Advisor",
    bio: "Dr. Okafor advises Servie on technology strategy and innovation. As a former CTO of several successful tech companies, her guidance has been invaluable in shaping our technical roadmap.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    name: "Ibrahim Mensah",
    role: "Business Strategy Advisor",
    bio: "Ibrahim brings decades of business development experience to Servie's advisory board. His insights on scaling marketplace businesses in emerging markets guides our growth strategy.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Aisha Mohammed",
    role: "Finance & Investment Advisor",
    bio: "Aisha advises Servie on financial strategy and investment opportunities. Her background in venture capital and financial management helps ensure Servie's sustainable growth.",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg"
  }
];

const Team = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-servie text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Meet Our Team</h1>
              <p className="text-lg opacity-90">
                The passionate people behind Servie working to connect service providers and clients
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.name} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">{member.role}</p>
                      </div>
                      <CardContent className="p-0">
                        <p className="text-sm mb-4">{member.bio}</p>
                        <div className="flex justify-center space-x-3">
                          <a href={member.social.twitter} className="text-muted-foreground hover:text-servie">
                            <Twitter className="h-4 w-4" />
                            <span className="sr-only">Twitter</span>
                          </a>
                          <a href={member.social.linkedin} className="text-muted-foreground hover:text-servie">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                          </a>
                          <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-servie">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </a>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold mt-16 mb-8">Advisory Board</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisors.map((advisor) => (
                  <Card key={advisor.name}>
                    <div className="p-6">
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={advisor.avatar} alt={advisor.name} />
                          <AvatarFallback>{advisor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-center">{advisor.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">{advisor.role}</p>
                      </div>
                      <CardContent className="p-0">
                        <p className="text-sm">{advisor.bio}</p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
