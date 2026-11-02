export class BlenderHelp {
  id: string;
  question: string;
  explanation: string;
  keywords: string[];
  version: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<BlenderHelp>) {
    Object.assign(this, partial);
  }
}
