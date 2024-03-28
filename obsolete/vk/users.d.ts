import { HttpService } from '@nestjs/axios';
import { EVkNameCase, EVkUser, IVkUser } from './types';
export declare class VkApiUsers {
    private readonly httpService;
    private readonly _token;
    private readonly _url;
    private readonly v;
    constructor(httpService: HttpService, _token: string, _url?: URL);
    get(fields?: EVkUser[], nameCase?: EVkNameCase, userIds?: number[]): Promise<{
        response: IVkUser[];
    }>;
}
