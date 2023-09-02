import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { EVkNameCase, EVkUser, IRequestUser, IVkUser } from './types';

export class VkApiUsers {
  private readonly v = '5.131';

  constructor(
    private readonly httpService: HttpService,
    private readonly _token: string,
    private readonly _url: URL = new URL(`https://api.vk.com`)
  ) {}

  async get(
    fields: EVkUser[] = null,
    nameCase: EVkNameCase = null,
    userIds: number[] = undefined
  ): Promise<{ response: IVkUser[] }> {
    this._url.pathname = '/method/users.get';
    const data: IRequestUser = {
      v: this.v,
    };

    if (fields) {
      data.fields = fields.join(',');
    }

    if (nameCase) {
      data.name_case = nameCase;
    }

    if (userIds) {
      data.user_ids = userIds.join(',');
    }

    const response = await this.httpService.axiosRef.post<
      IVkUser[],
      AxiosResponse<{ response: IVkUser[] }>,
      IRequestUser
    >(this._url.toString(), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this._token}`,
      },
    });

    return response.data;
  }
}
