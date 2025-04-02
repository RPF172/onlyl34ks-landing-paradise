
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCreator } from "@/services/creatorService";
import { fetchContentFilesByCreator } from "@/services/contentFileService";
import { getFileUrl } from "@/services/contentFileService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, File, Image, Video, HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function CreatorDetail() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { toast } = useToast();

  const { data: creator, isLoading: isCreatorLoading } = useQuery({
    queryKey: ["creator", creatorId],
    queryFn: () => fetchCreator(creatorId as string),
    enabled: !!creatorId,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading creator",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  });

  const { data: contentFiles, isLoading: isFilesLoading } = useQuery({
    queryKey: ["contentFiles", creatorId],
    queryFn: () => fetchContentFilesByCreator(creatorId as string),
    enabled: !!creatorId,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading content files",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  });

  const isLoading = isCreatorLoading || isFilesLoading;
  
  // Filter only preview files
  const previewFiles = contentFiles?.filter(file => file.is_preview === true) || [];
  
  // Calculate metadata
  const totalFileCount = contentFiles?.length || 0;
  const imageCount = contentFiles?.filter(file => file.file_type.startsWith('image/')).length || 0;
  const videoCount = contentFiles?.filter(file => file.file_type.startsWith('video/')).length || 0;
  const totalSize = contentFiles?.reduce((acc, file) => acc + file.file_size, 0) || 0;
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  // Determine file type icon
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6 text-onlyl34ks-accent" />;
    if (fileType.startsWith('video/')) return <Video className="h-6 w-6 text-onlyl34ks-accent" />;
    return <File className="h-6 w-6 text-onlyl34ks-accent" />;
  };

  if (isLoading) {
    return (
      <div className="container py-16">
        <Skeleton className="h-12 w-3/4 max-w-xl mb-4" />
        <Skeleton className="h-6 w-1/2 max-w-md mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
          
          <div>
            <Card className="bg-onlyl34ks-card border-0">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-6" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <motion.h1 
        className="text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {creator?.name}
      </motion.h1>
      
      <motion.p 
        className="text-xl text-onlyl34ks-accent mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {creator?.category}
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Preview Content</h2>
          
          {previewFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  className="aspect-square rounded-lg overflow-hidden bg-onlyl34ks-bg-light relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {file.file_type.startsWith('image/') ? (
                    <img 
                      src={getFileUrl(file.file_path)} 
                      alt={file.file_name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(file.file_type)}
                      <span className="ml-2 text-sm">{file.file_name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <p className="text-sm font-medium">{file.file_name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-onlyl34ks-text-muted italic">No preview content available.</p>
          )}
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-onlyl34ks-text-light">
              {creator?.bio || "No biography available for this creator."}
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-onlyl34ks-card border-0 sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Content Package</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-onlyl34ks-text-muted flex items-center">
                    <File className="mr-2 h-4 w-4" /> Total Files
                  </span>
                  <span className="font-medium">{totalFileCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-onlyl34ks-text-muted flex items-center">
                    <Image className="mr-2 h-4 w-4" /> Images
                  </span>
                  <span className="font-medium">{imageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-onlyl34ks-text-muted flex items-center">
                    <Video className="mr-2 h-4 w-4" /> Videos
                  </span>
                  <span className="font-medium">{videoCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-onlyl34ks-text-muted flex items-center">
                    <HardDrive className="mr-2 h-4 w-4" /> Total Size
                  </span>
                  <span className="font-medium">{formatFileSize(totalSize)}</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold mb-4 text-onlyl34ks-accent">$19.99</div>
                <Button className="w-full bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
