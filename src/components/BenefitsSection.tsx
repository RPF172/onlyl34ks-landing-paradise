
import { Lock, Star, Download, CreditCard, Users, FileText } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Download className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "True Digital Ownership",
      description: "Secure offline access to your content forever. No expiration dates."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "Predictable Spending",
      description: "No subscriptions or recurring fees - pay once and own it forever."
    },
    {
      icon: <Lock className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "Privacy & Security",
      description: "Discreet transactions and secure content delivery you can trust."
    },
    {
      icon: <Star className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "Build Your Collection",
      description: "Curate your personal digital library with premium content."
    },
    {
      icon: <Users className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "Support Creators",
      description: "Purchase directly supports content creators - no middlemen."
    },
    {
      icon: <FileText className="w-6 h-6 text-onlyl34ks-accent" />,
      title: "Exclusive Content",
      description: "Access unique content you won't find on subscription platforms."
    }
  ];

  return (
    <section id="benefits" className="bg-onlyl34ks-bg-darker py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">Why Choose ONLYL34KS</h2>
        <p className="section-subtitle">
          We're changing how digital content is purchased and owned, putting you in control.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="card hover:bg-onlyl34ks-bg-light transition-colors duration-300"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-onlyl34ks-text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
