import { Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "../components/ui/button";
import "../styles/globals.css";

export default function Footer() {
  return (
    <footer className="py-2 bg-background text-foreground border-t-1 border-border">
      <div className="container mx-auto px-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 Ryan Tran. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="icon">
              <a 
                href="https://github.com/RyanTren" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </Button>

            <Button asChild variant="ghost" size="icon">
              <a 
                href="https://www.linkedin.com/in/ryantren/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </Button>

            <Button asChild variant="ghost" size="icon">
              <a 
                href="https://instagram.com/uohto" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}