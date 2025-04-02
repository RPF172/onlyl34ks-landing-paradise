
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchCreators } from "@/services/creatorService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Creators() {
  const { toast } = useToast();

  const { data: creators, isLoading, error } = useQuery({
    queryKey: ["creators"],
    queryFn: fetchCreators,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading creators",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-onlyl34ks-card border-0">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Creators</h1>
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          Error loading creators. Please try again later.
        </div>
      </div>
    );
  }

  // Sort creators alphabetically by name
  const sortedCreators = [...(creators || [])].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Discover Creators</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCreators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={`/creators/${creator.id}`}>
              <Card className="bg-onlyl34ks-card border-0 hover:shadow-lg hover:bg-onlyl34ks-bg-light transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-onlyl34ks-text-light">
                    {creator.name}
                  </CardTitle>
                  <CardDescription className="text-onlyl34ks-accent">
                    {creator.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-onlyl34ks-text-muted line-clamp-3">
                    {creator.bio || "No biography available."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white">
                    View Content
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
