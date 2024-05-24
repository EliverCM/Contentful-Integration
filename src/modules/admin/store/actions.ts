import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { ManageUsersState } from './types';
import apiAdmin from '@/api/apiAdmin';

export const actions: ActionTree<ManageUsersState, RootState> = {

    async getSearchUsers (_, name) {
        return (await apiAdmin.getSearchUsers(name)).data;
    },

    async getAllScopes (_, params) {
        return (await apiAdmin.getAllScopes(params)).data;
    },

    async getAdminCompanies () {
        return (await apiAdmin.getCompaniesAdmin()).data;
    },

    async getAdminClients (_, payload) {
        return (await apiAdmin.getClientsByCompany(payload)).data;
    },

    async getAdminLocations (_, payload) {
        return (await apiAdmin.getLocationsByCompany(payload)).data;
    },

    async getAdminPrograms (_, params) {
        return (await apiAdmin.getProgramsByCompany(params)).data;
    },

    // async postUsersScope (_, params) {
    //     return (await apiAdmin.postUsersScope(params)).data;
    // },

    async deleteUserAdmin (_, params) {
        return (await apiAdmin.deleteUserAdmin(params)).data;
    },

    async getAllUsers () {
        return (await apiAdmin.getAllUsers()).data;
    },

    async getProgramsCompany (_, params) {
        return (await apiAdmin.getProgramsCompany(params)).data;
    },

    async getUserCompany (_, params) {
        return (await apiAdmin.getUserCompany(params)).data;
    },

    async addUserCompany (_, params) {
        return (await apiAdmin.addUserCompany(params)).data;
    },

    async removeUserCompany (_, params) {
        return (await apiAdmin.removeUserCompany(params)).data;
    },

};