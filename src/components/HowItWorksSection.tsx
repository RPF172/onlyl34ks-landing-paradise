
import React from "react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Discover",
      description: "Browse creators & unique content collections.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      ),
    },
    {
      number: 2,
      title: "Purchase",
      description: "Secure, private, one-time payment.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      ),
    },
    {
      number: 3,
      title: "Own",
      description: "Download your files instantly. Keep forever.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="bg-onlyl34ks-bg-dark py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">Get Your Exclusive Content in 3 Simple Steps</h2>
        <p className="section-subtitle">
          Our seamless process ensures you can quickly discover, purchase, and own content with ease.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card flex-1 flex flex-col items-center text-center hover:transform hover:scale-105 transition-all"
            >
              <div className="bg-onlyl34ks-accent/10 p-4 rounded-full mb-6">
                <div className="text-onlyl34ks-accent w-12 h-12 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <div className="bg-onlyl34ks-accent text-black w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-onlyl34ks-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
