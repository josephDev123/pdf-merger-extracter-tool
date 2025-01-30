import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FileUp, FilePlus, Trash2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useMutationAction } from "@/utils/useMutationAction";
import { TbLoader } from "react-icons/tb";

interface PDFFile {
  name: string;
  size: number;
  file: File;
}

interface DraggableItem {
  index: number;
  type: string;
}

export const PDFMerger = () => {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [togglePreview, setTogglePreview] = useState(false);
  // console.log(pdfs);

  const { mutateAsync, isPending } = useMutationAction(
    "post",
    "merge",
    "arraybuffer"
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please drop PDF files only",
        variant: "destructive",
      });
      return;
    }

    const newPdfs = files.map((file) => ({
      name: file.name,
      size: file.size,
      file,
    }));

    setPdfs((prev) => [...prev, ...newPdfs]);
    toast({
      title: "Files added",
      description: `Added ${files.length} PDF${files.length > 1 ? "s" : ""}`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );

    const newPdfs = files.map((file) => ({
      name: file.name,
      size: file.size,
      file,
    }));

    setPdfs((prev) => [...prev, ...newPdfs]);
    toast({
      title: "Files added",
      description: `Added ${files.length} PDF${files.length > 1 ? "s" : ""}`,
    });
  };

  const removePdf = (index: number) => {
    setPdfs((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "File removed",
      description: "PDF file removed from list",
    });
  };

  const movePdf = (fromIndex: number, toIndex: number) => {
    setPdfs((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
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
    const formDataPayload = new FormData();
    pdfs.forEach((item) => {
      formDataPayload.append("file", item.file);
    });

    mutateAsync(formDataPayload, {
      onSuccess: (data: any) => {
        try {
          const pdfData = new Blob([data], { type: "application/pdf" });
          const downloadLink = document.createElement("a");
          console.log(pdfData);
          const base64Url = URL.createObjectURL(pdfData);
          // downloadLink.href = URL.createObjectURL(pdfData);
          // downloadLink.download = "merged.pdf"; // Name of the file to be downloaded
          // downloadLink.click();
          setTogglePreview(true);
          setPreviewUrl(base64Url);

          toast({
            title: "Merged",
            description: "PDF merged successfully",
          });
        } catch (error) {
          console.error("Error processing PDF response:", error);
          toast({
            title: "Error",
            description: "Failed to process merged PDF",
            variant: "destructive",
          });
        }
      },
    });
  };

  const DraggablePDF = ({ pdf, index }: { pdf: PDFFile; index: number }) => {
    const [, drag] = useDrag<DraggableItem>({
      type: "PDF",
      item: { index, type: "PDF" },
    });

    const [, drop] = useDrop<DraggableItem>({
      accept: "PDF",
      hover: (item) => {
        if (item.index !== index) {
          movePdf(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className="flex items-center justify-between p-3 bg-muted rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Move size={20} className="text-muted-foreground cursor-move" />
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
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="p-6 animate-fade-up">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors hover:border-primary"
        >
          <FileUp className="mx-auto mb-4 text-muted-foreground" size={40} />
          <p className="text-lg font-medium mb-2">
            Drag and drop PDF files here
          </p>
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
            <h1>Re-arrange the File in the order you want the file to merge</h1>
            {pdfs.map((pdf, index) => (
              <DraggablePDF key={index} pdf={pdf} index={index} />
            ))}

            <Button
              onClick={mergePdfs}
              className="w-full mt-4 gap-2"
              disabled={pdfs.length < 2 || isPending}
            >
              Merge {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""}
              {isPending && <TbLoader className="text-sm" />}
            </Button>
          </div>
        )}
      </Card>
      <div className="flex items-center justify-between mt-4">
        <Button
          disabled={!previewUrl ? true : false}
          onClick={() => setTogglePreview((prev) => !prev)}
          className={` px-4 py-2 bg-green-500 text-white rounded-md inline-block sm:text-base text-sm`}
        >
          Toggle merged PDF
        </Button>

        <Button
          disabled={!previewUrl ? true : false}
          onClick={() => {
            setTogglePreview(false);
            setPreviewUrl("");
          }}
          className=" px-4 py-2 bg-red-500 text-white rounded-md inline-block hover:bg-red-300 sm:text-base text-sm"
        >
          Clear
        </Button>
      </div>

      {togglePreview && previewUrl && (
        <div className="w-full max-w-3xl mt-3">
          {/* Display PDF */}
          <iframe
            src={previewUrl}
            className="w-full h-[500px] border"
            title="PDF Preview"
          ></iframe>

          {/* Download Button */}
          <a
            href={previewUrl}
            download="preview.pdf"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md inline-block"
          >
            Download PDF
          </a>

          <Button
            onClick={() => setTogglePreview(false)}
            className="mt-4 px-4 py-2 ml-3 text-white rounded-md inline-block"
          >
            hide
          </Button>
        </div>
      )}
    </DndProvider>
  );
};
