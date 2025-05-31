export interface RecentTestSummary {
  passRate: number;
  totalTests: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  templateCount: number;
  lastModified: Date; // Use Date object for easier manipulation and display
  tags: string[];
  recentTestSummary?: RecentTestSummary; // Optional, might not be available for all collections
}