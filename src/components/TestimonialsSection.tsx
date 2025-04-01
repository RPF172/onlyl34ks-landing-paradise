
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Finally, I can buy content once and own it forever. No more monthly subscriptions for content I really want to keep.",
      name: "Alex Thompson",
      role: "Digital Collector",
      avatar: "/placeholder.svg"
    },
    {
      quote: "As a creator, ONLYL34KS lets me sell my work directly to fans who value ownership. The one-time payment model is a game-changer.",
      name: "Sarah Jensen",
      role: "Digital Artist",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The security and privacy aspects are fantastic. I can build my collection without worrying about my data being shared everywhere.",
      name: "Mike Rodriguez",
      role: "Privacy Advocate",
      avatar: "/placeholder.svg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-onlyl34ks-bg-light py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">What Users Are Saying</h2>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative">
            <div className="flex overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 transition-all duration-500 transform ${
                    index === currentIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute"
                  }`}
                >
                  <div className="card text-center p-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-onlyl34ks-accent/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-onlyl34ks-accent"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                      </div>
                    </div>
                    <p className="text-xl mb-6">{testimonial.quote}</p>
                    <div className="flex flex-col items-center">
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-onlyl34ks-text-muted text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-3 mt-6">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-onlyl34ks-bg-dark hover:bg-onlyl34ks-card transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-onlyl34ks-accent" : "bg-onlyl34ks-bg-dark"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-onlyl34ks-bg-dark hover:bg-onlyl34ks-card transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
