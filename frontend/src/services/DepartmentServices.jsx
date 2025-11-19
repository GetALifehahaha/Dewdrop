import React from 'react';
import api from './api';

const DepartmentServices = async (params, department_id = null, method = "GET") => {
    try {
        if (method === "GET") {
            const response = await api.get(`/tickets/departments/`);
            return response.data;
        } else if (method === "POST") {
            const response = await api.post('/tickets/departments/', params);
            return response.data;
        } else if (method === "DELETE") {
            const response = await api.delete(`/tickets/departments/${department_id}/`);
            return response;
        } else if (method === "PATCH") {
            const response = await api.patch(`/tickets/departments/${department_id}/`, params);
            return response;
        }
    } catch (err) {
        throw err;
    }
};

export default DepartmentServices;
