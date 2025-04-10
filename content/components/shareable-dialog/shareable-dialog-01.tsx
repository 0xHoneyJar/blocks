"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareableDialog01Props {
  imageUrl: string;
  triggerButtonText?: string;
  triggerButtonClassName?: string;
  triggerButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function ShareableDialog01({
  imageUrl = "https://placehold.co/1200x1200",
  triggerButtonText = "Share Image",
  triggerButtonClassName,
  triggerButtonVariant = "default",
}: ShareableDialog01Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopyLoading, setIsCopyLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setIsImageLoading(true);
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleCopyToClipboard = async () => {
    setIsCopyLoading(true);

    try {
      // Create a temporary image element
      const img: HTMLImageElement = document.createElement("img");
      img.crossOrigin = "anonymous";

      // Create a promise to handle image loading
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      // Convert canvas to blob and copy
      canvas.toBlob(async (blob) => {
        try {
          if (blob) {
            // Try the modern clipboard API first
            if (navigator.clipboard?.write) {
              await navigator.clipboard.write([
                new ClipboardItem({
                  [blob.type]: blob,
                }),
              ]);
            } else {
              // Fallback to legacy clipboard API
              const data = new ClipboardItem({
                [blob.type]: blob,
              });
              await navigator.clipboard.write([data]);
            }
            setIsCopied(true);
            toast.success("Image copied to clipboard!", {
              description: "You can now paste it directly into X",
            });
          }
        } catch (error) {
          console.error("Clipboard API failed:", error);
          // Fallback to copying the image URL
          await navigator.clipboard.writeText(imageUrl);
          setIsCopied(true);
          toast.success("Image URL copied to clipboard!", {
            description: "You can now paste the URL into X",
          });
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to copy:", error);
      // Final fallback - just copy the URL
      try {
        await navigator.clipboard.writeText(imageUrl);
        setIsCopied(true);
        toast.success("Image URL copied to clipboard!", {
          description: "You can now paste the URL into X",
        });
      } catch (finalError) {
        toast.error("Failed to copy image", {
          description:
            "Please try downloading and uploading the image manually",
        });
      }
    } finally {
      setIsCopyLoading(false);
    }
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const tweetText = `Check out my generated image!\n\n`;

      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;
      window.open(tweetUrl, "_blank");
      setIsOpen(false);
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerButtonVariant}
          className={cn("gap-2", triggerButtonClassName)}
        >
          <Share2 className="h-4 w-4" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Share your Image
          </DialogTitle>
          <DialogDescription>
            Copy your image and share it on X.com
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-background">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Share preview"
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                unoptimized
                onLoadingComplete={() => setIsImageLoading(false)}
              />
            )}
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCopyToClipboard}
              disabled={isCopyLoading}
            >
              {isCopyLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Copying...
                </>
              ) : isCopied ? (
                "Copied!"
              ) : (
                "Copy to Clipboard"
              )}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleShare}
              disabled={isLoading || !isCopied}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>X</title>
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                    Post
                  </div>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
