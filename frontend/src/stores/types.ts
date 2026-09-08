export interface FilterState {
  assignees: string[];
  priorities: string[];
  tags: string[];
  statuses: string[];
  search: string;
}

export type ViewMode = "list" | "kanban";
