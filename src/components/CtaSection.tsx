
import React from "react";

const CtaSection = () => {
  return (
    <section className="bg-onlyl34ks-bg-dark py-16 md:py-24 border-t border-onlyl34ks-bg-light/20">
      <div className="container-section">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="section-title">Ready to Own Your Digital World?</h2>
          <p className="text-xl mb-12 text-onlyl34ks-text-light/80">
            No subscriptions, just exclusive content you own forever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#explore" className="btn-primary text-lg">
              Explore Exclusive Content
            </a>
            <button className="btn-secondary text-lg">
              Are you a Creator?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
