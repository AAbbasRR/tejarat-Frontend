import DashboardTypes from '../types/DashboardTypes';

export const loadingAcion = (isLoading = false) => {
    return {
        type: DashboardTypes.loading,
        isLoading,
    };
};
