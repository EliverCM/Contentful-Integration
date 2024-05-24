export interface Notification {
    ROWNUM: number;
    active: number;
    idEmployeeNotifications: number;
    title: string;
    dateCreated: string;
    descType: string;
    idSender: number;
    nameEmp: string;
    typeNotification: number;
    state: number;
    body: string;
    urlNoti: string;
    extraInfo: string;
}

export interface NotificationList {
    notificationList: Notification[];
}