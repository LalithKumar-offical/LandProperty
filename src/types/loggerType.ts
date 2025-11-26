export interface Logger {
  logId: number;
  action?: string;
  entityType?: string;
  entityId?: number;
  description?: string;
  actionDate: Date;
  userName?: string;
}

export interface LogEntry {
  LogId: number;
  Action: string;
  EntityType: string;
  EntityId: number;
  Description: string;
  ActionDate: string;
  UserName?: string;
}
