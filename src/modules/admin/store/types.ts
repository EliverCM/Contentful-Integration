export interface User {
    iduser: number;
    description: string;
}

export interface Company {
    idcompany: number;
    description: string;
    users: Array<User>;
}

export interface Access {
    idaccesss: number;
    action: string;
    entity: string;
}

export interface ManageUsersState {
    companies?: Array<Company>;
    users?: Array<User>;
    company?: Company;
    user?: User;
    // user?: any;
}
