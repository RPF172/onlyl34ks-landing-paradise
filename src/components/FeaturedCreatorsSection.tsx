
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Music, Video, FileText, Image as ImageIcon } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Content type icons mapping
const contentTypeIcons = {
  "Art": <ImageIcon size={14} />,
  "Music": <Music size={14} />,
  "Videos": <Video size={14} />,
  "Writing": <FileText size={14} />,
};

const FeaturedCreatorsSection = () => {
  const creators = [
    {
      id: 1,
      name: "Sir Kraze",
      avatar: "https://oociyoccgjtjdtripnoc.supabase.co/storage/v1/object/public/assets/featured/KingSirKraze-1360692893871128583-20210213_145041-img1.jpg",
      specialties: ["Music", "Videos"],
      bio: "Renowned for unique beats and immersive audio experiences",
      featuredContent: [
        {
          id: 101,
          title: "Cosmic Waves EP",
          type: "Music",
          image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
          description: "A journey through sound and space"
        },
        {
          id: 102,
          title: "Studio Session: The Process",
          type: "Videos",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
          description: "Behind the scenes of creating music"
        }
      ]
    },
    {
      id: 2,
      name: "Boss Master Carlos",
      avatar: "https://oociyoccgjtjdtripnoc.supabase.co/storage/v1/object/public/assets/featured/FZ5pfq9UYAALBfJ.jpeg",
      specialties: ["Art", "Writing"],
      bio: "Digital artist specializing in crypto-themed artwork and analysis",
      featuredContent: [
        {
          id: 201,
          title: "Blockchain Visualized",
          type: "Art",
          image: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
          description: "Visual interpretations of blockchain technology"
        },
        {
          id: 202,
          title: "Crypto Market Analysis",
          type: "Writing",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
          description: "In-depth look at market trends and opportunities"
        }
      ]
    },
    {
      id: 3,
      name: "Cash Master James",
      avatar: "https://oociyoccgjtjdtripnoc.supabase.co/storage/v1/object/public/assets/featured/20220210_215827.jpg",
      specialties: ["Videos", "Writing"],
      bio: "Financial guide sharing exclusive wealth-building strategies",
      featuredContent: [
        {
          id: 301,
          title: "Wealth Building Secrets",
          type: "Videos",
          image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc",
          description: "Step-by-step guides to financial freedom"
        },
        {
          id: 302,
          title: "Investment Portfolio Guide",
          type: "Writing",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
          description: "How to diversify and maximize returns"
        }
      ]
    }
  ];

  // Active content for each creator (first content item by default)
  const [activeContent, setActiveContent] = useState<{ [key: number]: number }>({
    1: 101,
    2: 201,
    3: 301
  });

  // Function to toggle between creator's content
  const toggleContent = (creatorId: number, contentId: number) => {
    setActiveContent(prev => ({
      ...prev,
      [creatorId]: contentId
    }));
  };

  return (
    <section id="creators" className="bg-onlyl34ks-bg-dark py-16 md:py-24">
      <div className="container-section">
        <h2 className="section-title">Featured Creators</h2>
        <p className="section-subtitle mb-12">
          Discover exclusive content from our top creators
        </p>

        <div className="mx-auto max-w-7xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {creators.map((creator) => {
                // Find the currently active content for this creator
                const currentContent = creator.featuredContent.find(
                  content => content.id === activeContent[creator.id]
                ) || creator.featuredContent[0];

                return (
                  <CarouselItem 
                    key={creator.id} 
                    className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <div className="card flex flex-col h-full">
                      {/* Creator profile section */}
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-onlyl34ks-accent">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback className="bg-onlyl34ks-accent text-black">
                            {creator.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{creator.name}</h3>
                          <div className="flex gap-1 mt-1">
                            {creator.specialties.map((specialty, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs bg-onlyl34ks-bg-light border-onlyl34ks-accent flex items-center gap-1 py-0"
                              >
                                {contentTypeIcons[specialty as keyof typeof contentTypeIcons]} 
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Creator bio */}
                      <p className="text-sm text-onlyl34ks-text-muted mb-4 line-clamp-2">
                        {creator.bio}
                      </p>
                      
                      {/* Featured content section */}
                      <div className="relative group rounded-lg overflow-hidden mb-4 flex-grow">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={currentContent.image}
                            alt={currentContent.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge className="bg-onlyl34ks-accent text-black font-medium text-xs flex items-center gap-1">
                              {contentTypeIcons[currentContent.type as keyof typeof contentTypeIcons]} 
                              {currentContent.type}
                            </Badge>
                            <span className="text-xs text-onlyl34ks-text-light/80">Featured</span>
                          </div>
                          <h4 className="text-md font-bold text-white">{currentContent.title}</h4>
                          <p className="text-xs text-onlyl34ks-text-light/90 line-clamp-1">
                            {currentContent.description}
                          </p>
                        </div>
                      </div>

                      {/* Content selector */}
                      <div className="flex gap-2 mb-4">
                        {creator.featuredContent.map((content) => (
                          <button
                            key={content.id}
                            onClick={() => toggleContent(creator.id, content.id)}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              activeContent[creator.id] === content.id
                                ? "bg-onlyl34ks-accent"
                                : "bg-onlyl34ks-bg-light hover:bg-onlyl34ks-bg-light/70"
                            }`}
                            aria-label={`View ${content.title}`}
                          ></button>
                        ))}
                      </div>

                      {/* Action button */}
                      <button className="btn-secondary mt-auto text-sm py-2 flex items-center justify-center gap-2 w-full">
                        <span>Browse Content from {creator.name}</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex absolute -left-12 top-1/2" />
            <CarouselNext className="hidden lg:flex absolute -right-12 top-1/2" />
          </Carousel>
          
          {/* Mobile navigation dots */}
          <div className="flex justify-center gap-1 mt-6 md:hidden">
            {creators.map((creator, index) => (
              <div 
                key={creator.id}
                className={`w-2 h-2 rounded-full ${index === 0 ? "bg-onlyl34ks-accent" : "bg-onlyl34ks-bg-light"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreatorsSection;
