
import { CircleCheck, X } from "lucide-react";

const ProblemSolutionSection = () => {
  return (
    <section id="problem" className="bg-onlyl34ks-bg-light py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">Tired of Subscription Fatigue?</h2>
        <p className="section-subtitle">
          The endless cycle of recurring payments and disappearing content stops here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mt-16">
          {/* Problem side */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-onlyl34ks-text-light mb-6">
              The Subscription Problem
            </h3>
            
            <div className="space-y-4">
              {[
                { problem: "Monthly recurring costs that add up" },
                { problem: "Content disappears when you stop paying" },
                { problem: "Platform lock-in with no real ownership" },
                { problem: "Limited download options" },
                { problem: "Constant price increases" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 text-red-500">
                    <X size={20} />
                  </div>
                  <p className="text-lg">{item.problem}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Solution side */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-onlyl34ks-accent mb-6">
              The ONLYL34KS Solution
            </h3>
            
            <div className="space-y-4">
              {[
                { solution: "Single payment model – no recurring fees" },
                { solution: "True ownership – yours forever" },
                { solution: "Downloadable files that never expire" },
                { solution: "Privacy focused & secure transactions" },
                { solution: "Direct support for your favorite creators" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 text-onlyl34ks-accent">
                    <CircleCheck size={20} />
                  </div>
                  <p className="text-lg">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
