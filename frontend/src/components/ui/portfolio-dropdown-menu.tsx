import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import { ChevronDown } from "lucide-react";

import "../../types/types";
import type { PortfolioSelectProps } from "../../types/types";

export function PortfolioSelect({ portfolios, selectedId, onSelect }: PortfolioSelectProps) {
  const selectedPortfolio = portfolios.find(p => p.id === selectedId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-between items-center gap-10">
          <span>{selectedPortfolio ? selectedPortfolio.name : "Select a portfolio..."}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {portfolios.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => onSelect(p.id)}>
            {p.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
