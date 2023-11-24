"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRole = exports.ReportStatus = exports.AdminPermission = exports.EUserRole = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["UNCONFIRMED"] = 0] = "UNCONFIRMED";
    UserStatus[UserStatus["CONFIRMED"] = 1] = "CONFIRMED";
    UserStatus[UserStatus["VERIFIED"] = 2] = "VERIFIED";
    UserStatus[UserStatus["ACTIVATED"] = 3] = "ACTIVATED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var EUserRole;
(function (EUserRole) {
    EUserRole["MASTER"] = "master";
    EUserRole["ADMIN"] = "admin";
    EUserRole["RECIPIENT"] = "recipient";
    EUserRole["VOLUNTEER"] = "volunteer";
})(EUserRole || (exports.EUserRole = EUserRole = {}));
var AdminPermission;
(function (AdminPermission) {
    AdminPermission["CONFIRMATION"] = "confirm users";
    AdminPermission["TASKS"] = "create tasks";
    AdminPermission["KEYS"] = "give keys";
    AdminPermission["CONFLICTS"] = "resolve conflicts";
    AdminPermission["BLOG"] = "write the blog";
    AdminPermission["CATEGORIES"] = "change categories";
})(AdminPermission || (exports.AdminPermission = AdminPermission = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["NEW"] = "new";
    ReportStatus["INACTIVE"] = "inactive";
    ReportStatus["ACTIVE"] = "active";
    ReportStatus["BLOCKED"] = "blocked";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportRole;
(function (ReportRole) {
    ReportRole["RECIPIENT"] = "recipient";
    ReportRole["VOLUNTEER"] = "volunteer";
})(ReportRole || (exports.ReportRole = ReportRole = {}));
//# sourceMappingURL=index.js.map