export interface Chat {
  id: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ConflictChat extends Chat {
  conflictType: string;
}
