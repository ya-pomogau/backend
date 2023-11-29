"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VkApiUsers = void 0;
const configuration_1 = require("../../src/config/configuration");
class VkApiUsers {
    constructor(httpService, _token, _url = new URL((0, configuration_1.default)().vk.api)) {
        this.httpService = httpService;
        this._token = _token;
        this._url = _url;
        this.v = '5.131';
    }
    async get(fields = null, nameCase = null, userIds = undefined) {
        this._url.pathname = '/method/users.get';
        const data = {
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
        const response = await this.httpService.axiosRef.post(this._url.toString(), data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this._token}`,
            },
        });
        return response.data;
    }
}
exports.VkApiUsers = VkApiUsers;
//# sourceMappingURL=users.js.map