import {Card, CardFooter, Image} from "@heroui/react";

interface HeroCardProps {
  footerText: React.ReactNode;
  placeImage?: string;
}

export default function HeroCard({ footerText, placeImage }: HeroCardProps) {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt="Woman listing to music"
        className="object-cover w-full h-auto max-w-md mx-auto"
        src={placeImage || "https://placehold.co/400x400?text=Hello+World"}
      />
      <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-3 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{footerText}</p>
      </CardFooter>
    </Card>
  );
}
