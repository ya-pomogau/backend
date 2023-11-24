export declare enum UserStatus {
    UNCONFIRMED = 0,
    CONFIRMED = 1,
    VERIFIED = 2,
    ACTIVATED = 3
}
export declare enum EUserRole {
    MASTER = "master",
    ADMIN = "admin",
    RECIPIENT = "recipient",
    VOLUNTEER = "volunteer"
}
export declare enum AdminPermission {
    CONFIRMATION = "confirm users",
    TASKS = "create tasks",
    KEYS = "give keys",
    CONFLICTS = "resolve conflicts",
    BLOG = "write the blog",
    CATEGORIES = "change categories"
}
export declare enum ReportStatus {
    NEW = "new",
    INACTIVE = "inactive",
    ACTIVE = "active",
    BLOCKED = "blocked"
}
export declare enum ReportRole {
    RECIPIENT = "recipient",
    VOLUNTEER = "volunteer"
}
