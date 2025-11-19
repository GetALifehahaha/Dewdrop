import { useState, useEffect } from "react";
import { DepartmentServices } from "../services"; // Make sure this handles API calls

export default function useDepartment() {
    const [departmentResponse, setDepartmentResponse] = useState();
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentLoading, setDepartmentLoading] = useState(true);
    const [departmentError, setDepartmentError] = useState(null);

    // GET LIST
    const fetchDepartments = async () => {
        try {
            setDepartmentLoading(true);

            const data = await DepartmentServices();
            setDepartmentData(data);
        } catch (err) {
            setDepartmentError(err);
        } finally {
            setDepartmentLoading(false);
        }
    };

    // CREATE
    const postDepartment = async (newDepartment) => {
        setDepartmentLoading(true);
        try {
            await DepartmentServices(newDepartment, "POST");
            setDepartmentResponse({ status: "success", detail: "Department created successfully." });
            fetchDepartments();
        } catch (err) {
            setDepartmentError({ status: "error", detail: "Failed to create department." });
            setDepartmentResponse(null);
        } finally {
            setDepartmentLoading(false);
        }
    };

    // UPDATE
    const patchDepartment = async (id, params) => {
        setDepartmentLoading(true);
        try {
            await DepartmentServices(params, id, "PATCH");
            setDepartmentResponse({ status: "success", detail: "Department updated successfully." });
            fetchDepartments();
        } catch (err) {
            setDepartmentError({ status: "error", detail: "Failed to update department." });
            setDepartmentResponse(null);
        } finally {
            setDepartmentLoading(false);
        }
    };

    // DELETE
    const deleteDepartment = async (id) => {
        setDepartmentLoading(true);
        try {
            await DepartmentServices(id, "DELETE");
            setDepartmentResponse({ status: "success", detail: "Department deleted successfully." });
            fetchDepartments();
        } catch (err) {
            setDepartmentError({ status: "error", detail: "Failed to delete department." });
            setDepartmentResponse(null);
        } finally {
            setDepartmentLoading(false);
        }
    };

    // Refresh
    const refresh = () => {
        fetchDepartments();
    };

    // Load on first render
    useEffect(() => {
        fetchDepartments();
    }, []);

    return {
        departmentData,
        departmentResponse,
        departmentLoading,
        departmentError,
        fetchDepartments,
        postDepartment,
        patchDepartment,
        deleteDepartment,
        refresh,
    };
}
