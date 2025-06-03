export interface CreateRepository {
  name: string;
  description: string;
  promptTextIds?: string[];
  tags: string[];
}

export interface RecentTestSummary {
  passRate: number;
  totalTests: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  promptTextIds: string[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  recentTestSummary?: RecentTestSummary;
}

export interface UpdateRepository {
  name?: string;
  description?: string;
  promptTextIds?: string[];
  updatedAt?: Date;
  tags?: string[];
  recentTestSummary?: RecentTestSummary;
}