"use client";

import type { ReactNode } from "react";
import { ChallengeList } from "./challenge-list";
import { DisclosureFlow } from "./disclosure-flow";
import { SearchArchitecture } from "./search-architecture";
import { IdentityToggle } from "./identity-toggle";

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

interface ChallengePageContentProps {
  challenges: ChallengeData[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <DisclosureFlow />,
    "challenge-2": <SearchArchitecture />,
    "challenge-3": <IdentityToggle />,
  };

  return <ChallengeList challenges={challenges} visualizations={visualizations} />;
}
