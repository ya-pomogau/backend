"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EResponseType = exports.EScope = exports.EDisplay = void 0;
var EDisplay;
(function (EDisplay) {
    EDisplay["page"] = "page";
    EDisplay["popup"] = "popup";
    EDisplay["mobile"] = "mobile";
})(EDisplay || (exports.EDisplay = EDisplay = {}));
var EScope;
(function (EScope) {
    EScope["notify"] = "notify";
    EScope["friends"] = "friends";
    EScope["photos"] = "photos";
    EScope["audio"] = "audio";
    EScope["video"] = "video";
    EScope["stories"] = "stories";
    EScope["pages"] = "pages";
    EScope["menu"] = "menu";
    EScope["status"] = "status";
    EScope["notes"] = "notes";
    EScope["messages"] = "messages";
    EScope["wall"] = "wall";
    EScope["ads"] = "ads";
    EScope["offline"] = "offline";
    EScope["docs"] = "docs";
    EScope["groups"] = "groups";
    EScope["notifications"] = "notifications";
    EScope["stats"] = "stats";
    EScope["email"] = "email";
    EScope["market"] = "market";
    EScope["phone_number"] = "phone_number";
})(EScope || (exports.EScope = EScope = {}));
var EResponseType;
(function (EResponseType) {
    EResponseType["code"] = "code";
    EResponseType["token"] = "token";
})(EResponseType || (exports.EResponseType = EResponseType = {}));
//# sourceMappingURL=enums.js.map