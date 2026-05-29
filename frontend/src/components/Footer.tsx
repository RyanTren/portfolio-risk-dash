import { Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "../components/ui/button";
import "../styles/globals.css";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full py-2 bg-background text-muted-foreground border-t border-border z-9999999">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Ryan Tran. All rights reserved.
          </p>

          <p className="text-[10px] text-muted-foreground opacity-60 text-center mt-3">
            Educational demo only. Not financial advice.
          </p>

          <div className="flex gap-2">
            <Button asChild variant="ghost" size="icon">
              <a
                href="https://github.com/RyanTren"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-3 h-3" />
              </a>
            </Button>

            <Button asChild variant="ghost" size="icon">
              <a
                href="https://www.linkedin.com/in/ryantren/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
              </a>
            </Button>

            <Button asChild variant="ghost" size="icon">
              <a
                href="https://instagram.com/uohto"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
