import { api } from '@/api/mytp';

export default {

    async getSearchUsers (name: string, page = 1) {
        return api.get('users', { params: { name, page } });
    },

    async getAllUsers () {
        return api.get('users?page=1&isContentCreator=true');
    },

    async getAllScopes (params: any) {
        const payload = {
            idCompany: params.idCompany
        };
        return api.get(`users/${params.oid}/asignableScopes`, { params: payload });
    },

    async getCompaniesAdmin () {
        return api.get('users/me/companies');
    },

    async getClientsByCompany (params: any) {
        return api.post(`admin/companies/${params.idCompany}/clients/locations?oid=${params.oid}`, { locations: params.locations });
    },

    async getLocationsByCompany (params: any) {
        const payload = {
            idCompany: params.idCompany
        };
        return api.get(`users/${params.oid}/asignableScopes`, { params: payload });
    },

    async getProgramsByCompany (params: any) {
        return api.post(`admin/companies/${params.idCompany}/programs?oid=${params.oid}`, params.scopes);
    },

    async deleteUserAdmin (params: any) {
        return api.delete(`users/${params.oid}`);
    },

    async getProgramsCompany (params: any) {
        return api.get(`admin/companies/${params.idCompany}/programs?oid=${params.oid}`);
    },

    async getUserCompany (params: any) {
        return api.get(`/users/companies?oid=${params.oid}`);
    },

    async addUserCompany (params: any) {
        return api.post(`users/${params.oid}/companies`, params.content); // companies: [ids]
    },

    async removeUserCompany (payload: any) {
        const params = {
            companies: payload.content.companies.toString()
        };
        return api.delete(`users/${payload.oid}/companies`, { params }); // companies: [ids]
    },

};