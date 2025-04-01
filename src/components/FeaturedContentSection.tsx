
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

const FeaturedContentSection = () => {
  const contentCategories = ["All", "Art", "Music", "Videos", "Writing"];
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const featuredContent = [
    {
      id: 1,
      title: "Cosmic Nebula Collection",
      creator: "DigitalArtistry",
      type: "Art",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      id: 2,
      title: "Tech Beats Vol. 3",
      creator: "SynthMaster",
      type: "Music",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7", 
    },
    {
      id: 3,
      title: "Zero Day: The Documentary",
      creator: "CyberChronicles",
      type: "Videos",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    },
    {
      id: 4,
      title: "Algorithms Explained",
      creator: "CodeMaster",
      type: "Writing",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    },
    {
      id: 5,
      title: "Network Architecture Series",
      creator: "TechVisionary",
      type: "Art",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    },
    {
      id: 6,
      title: "Digital Privacy Guide",
      creator: "SecureNet",
      type: "Writing",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
  ];

  const filteredContent = activeCategory === "All" 
    ? featuredContent 
    : featuredContent.filter(item => item.type === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 320;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section id="explore" className="bg-onlyl34ks-bg-dark py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">Explore Content You Won't Find Anywhere Else</h2>
        <p className="section-subtitle">
          Browse our collection of exclusive digital content created by talented individuals
        </p>

        <div className="flex justify-center gap-2 sm:gap-4 mb-12 overflow-x-auto pb-4">
          {contentCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? "bg-onlyl34ks-accent text-black font-medium"
                  : "bg-onlyl34ks-bg-light text-onlyl34ks-text-light hover:bg-onlyl34ks-bg-light/70"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full hidden sm:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-none"
          >
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] max-w-[280px] card flex flex-col snap-start"
              >
                <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 bg-onlyl34ks-bg-dark/80 text-xs font-medium py-1 px-2 rounded-full">
                    {item.type}
                  </div>
                  <div className="absolute top-2 right-2 bg-onlyl34ks-accent text-xs text-black font-medium py-1 px-2 rounded-full flex items-center gap-1">
                    <Lock size={12} /> Exclusive
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-onlyl34ks-text-muted text-sm mb-4">by {item.creator}</p>
                <button className="btn-secondary mt-auto text-sm py-2 w-full">View Details</button>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full hidden sm:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContentSection;
