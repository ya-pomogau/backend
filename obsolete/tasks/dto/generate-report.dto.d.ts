import { TaskStatus } from '../types';
export declare class GenerateReportDto {
    status: TaskStatus;
    startDate: Date;
    endDate: Date;
    check?: boolean;
}
