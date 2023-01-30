import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protectedRoute/ProtectedRoute';

import AccountingLayout from '../../layouts/accounting/AccountingLayout';

// import Page404 from '../../containers/page404/Page404';

import Login from '../../auth/login/Login';

import Dashboard from '../../accounting/dashboard/Dashboard';

const AppRouter = () => {
    const routes = [
        // {
        //     path: '*',
        //     component: <Page404 />,
        //     protected: false,
        //     exact: false,
        // },
        {
            path: '/',
            component: <Login />,
            protected: false,
            exact: true
        },
        {
            path: '/dashboard',
            component: <Dashboard />,
            protected: true,
            exact: true
        },
    ]
    return (
        <Routes>
            {routes.map((element, index) => (
                <>
                    <Route key={`approutes_${index}`} exact={element.exact} path={element.path} element={element.protected ?
                        <ProtectedRoute>
                            <AccountingLayout>
                                {element.component}
                            </AccountingLayout>
                        </ProtectedRoute>
                        :
                        element.component
                    } />
                </>
            ))}
        </Routes>
    );
};

export default AppRouter