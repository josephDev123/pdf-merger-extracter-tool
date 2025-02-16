import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFMerger } from "@/components/PDFMerger";
import { PDFExtracter } from "@/components/PDFExtractter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Merge & Extract PDF Tools
          </h1>
          <p className="text-lg text-muted-foreground">
            Merge multiple PDFs into one or extract specific page(s) from PDF
          </p>
        </div>

        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Extract PDF</TabsTrigger>
          </TabsList>
          <TabsContent value="merge" className="mt-0">
            <PDFMerger />
          </TabsContent>
          <TabsContent value="split" className="mt-0">
            <PDFExtracter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
