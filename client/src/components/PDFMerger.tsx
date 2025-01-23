import { useState } from "react";
import { FileUp, FilePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface PDFFile {
  name: string;
  size: number;
  file: File;
}

export const PDFMerger = () => {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please drop PDF files only",
        variant: "destructive",
      });
      return;
    }

    const newPdfs = files.map(file => ({
      name: file.name,
      size: file.size,
      file,
    }));

    setPdfs(prev => [...prev, ...newPdfs]);
    toast({
      title: "Files added",
      description: `Added ${files.length} PDF${files.length > 1 ? 's' : ''}`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files).filter(
      file => file.type === "application/pdf"
    );

    const newPdfs = files.map(file => ({
      name: file.name,
      size: file.size,
      file,
    }));

    setPdfs(prev => [...prev, ...newPdfs]);
    toast({
      title: "Files added",
      description: `Added ${files.length} PDF${files.length > 1 ? 's' : ''}`,
    });
  };

  const removePdf = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "File removed",
      description: "PDF file removed from list",
    });
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please add at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming soon",
      description: "PDF merging functionality will be implemented soon",
    });
  };

  return (
    <Card className="p-6 animate-fade-up">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors hover:border-primary"
      >
        <FileUp className="mx-auto mb-4 text-muted-foreground" size={40} />
        <p className="text-lg font-medium mb-2">Drag and drop PDF files here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <Button variant="outline" className="relative">
          Choose files
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
      </div>

      {pdfs.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FilePlus size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">{pdf.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(pdf.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePdf(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}

          <Button
            onClick={mergePdfs}
            className="w-full mt-4"
            disabled={pdfs.length < 2}
          >
            Merge {pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </Card>
  );
};