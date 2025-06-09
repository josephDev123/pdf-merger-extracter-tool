import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFMerger } from "@/components/PDFMerger";
import { PDFExtracter } from "@/components/PDFExtractter";
import { Link, useNavigate } from "react-router-dom";
import SwitchTheme from "@/components/SwitchThemeBtn";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white px-6  md:px-12 md:pb-12  dark:bg-black dark:text-white text-black">
      <div className="flex items-center justify-between py-2">
        <a
          href="https://buymeacoffee.com/josephdev"
          target="_blank"
          rel="noopener noreferrer"
          className="w-28 "
        >
          <img src={"/buymeCoffee.png"} alt="" className="" />
        </a>
        <SwitchTheme />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="sm:text-4xl text-2xl font-bold tracking-tight">
            Merge & Extract PDF Tools.
          </h1>
          <p className="sm:text-lg  text-muted-foreground">
            Merge multiple PDFs into one or extract specific page(s) from PDF.
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
