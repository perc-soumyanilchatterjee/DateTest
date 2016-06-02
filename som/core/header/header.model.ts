import { UserOptions } from './user-options.model';

export interface HeaderData {
  appName: string;
  apps?: any[];
  navData?: any[];
  settings?: any[];
  userOptions?: UserOptions;
}
