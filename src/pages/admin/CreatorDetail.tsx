
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCreator } from '@/services/creatorService';
import AdminLayout from "@/layouts/AdminLayout";
import FileUploadForm from '@/components/admin/FileUploadForm';
import ContentFilesList from '@/components/admin/ContentFilesList';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("files");
  
  const { data: creator, isLoading, isError } = useQuery({
    queryKey: ['creator', id],
    queryFn: () => fetchCreator(id as string),
    enabled: !!id
  });

  const handleBackClick = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-onlyl34ks-accent" />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !creator) {
    return (
      <AdminLayout>
        <div className="container px-4 py-10 mx-auto">
          <div className="bg-red-500/20 text-red-200 p-4 rounded-md">
            An error occurred while loading creator details.
          </div>
          <Button onClick={handleBackClick} className="mt-4">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Creators
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-4 py-10 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBackClick} className="mr-4">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-white">{creator.name} - Creator Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-onlyl34ks-card p-6 rounded-lg border border-onlyl34ks-bg-light/20">
            <h2 className="text-xl font-semibold mb-4">Creator Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-onlyl34ks-text-muted">Name</p>
                <p className="text-white font-medium">{creator.name}</p>
              </div>
              <div>
                <p className="text-onlyl34ks-text-muted">Category</p>
                <p className="text-white font-medium">{creator.category}</p>
              </div>
              <div>
                <p className="text-onlyl34ks-text-muted">Bio</p>
                <p className="text-white">{creator.bio || "No bio provided"}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                onClick={() => navigate(`/admin`)} 
                variant="outline" 
                className="w-full"
              >
                Edit Creator
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-onlyl34ks-card p-6 rounded-lg border border-onlyl34ks-bg-light/20">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-onlyl34ks-bg-light/10">
                  <TabsTrigger value="files">Content Files</TabsTrigger>
                  <TabsTrigger value="upload">Upload Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="files" className="mt-0">
                  <ContentFilesList creatorId={creator.id} />
                </TabsContent>
                
                <TabsContent value="upload" className="mt-0">
                  <FileUploadForm
                    creatorId={creator.id}
                    onSuccess={() => setActiveTab("files")}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
