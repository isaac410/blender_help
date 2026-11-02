export interface BlenderHelp {
  id: string;
  title: string;
  shortcut: string;
  description: string;
  blenderVersion: string;
  mode: string;
  category: string;
  tags: string[];
  tip?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateBlenderHelpPayload {
  title: string;
  shortcut: string;
  description: string;
  blenderVersion: string;
  mode: string;
  category: string;
  tags: string[];
  tip?: string;
}

export interface FilterParams {
  version: string;
  tag: string;
  mode: string;
  category: string;
  search: string;
}
