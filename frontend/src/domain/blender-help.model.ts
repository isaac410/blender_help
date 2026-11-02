export interface BlenderHelp {
  id: string;
  question: string;
  explanation: string;
  keywords: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateBlenderHelpInput = Omit<BlenderHelp, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlenderHelpInput = Partial<CreateBlenderHelpInput>;
