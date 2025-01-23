import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFMerger } from "@/components/PDFMerger";
import { PDFSplitter } from "@/components/PDFSplitter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">PDF Tools</h1>
          <p className="text-lg text-muted-foreground">
            Merge multiple PDFs into one or split a PDF into multiple files
          </p>
        </div>

        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Split PDF</TabsTrigger>
          </TabsList>
          <TabsContent value="merge" className="mt-0">
            <PDFMerger />
          </TabsContent>
          <TabsContent value="split" className="mt-0">
            <PDFSplitter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
