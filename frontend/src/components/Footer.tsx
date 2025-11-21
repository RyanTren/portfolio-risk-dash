import { Github , Linkedin, Instagram } from "lucide-react";
import { Button } from "../components/ui/button";
import "../styles/globals.css";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-2 py-3 bg-background text-foreground border-t border-border">
			<a className="m-0">Ryan Tran @ F25'</a>
			
			<div className="flex gap-4">
				<Button asChild variant="ghost" size="icon">
					<a href="https://github.com/RyanTren" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
						<Github className="w-5 h-5" />
					</a>
				</Button>

				<Button asChild variant="ghost" size="icon">
					<a href="https://www.linkedin.com/in/ryantren/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
						<Linkedin className="w-5 h-5" />
					</a>
				</Button>

				<Button asChild variant="ghost" size="icon">
					<a href="https://instagram.com/uohto" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
						<Instagram className="w-5 h-5" />
					</a>
				</Button>
			</div>
		</footer>
  );
}
