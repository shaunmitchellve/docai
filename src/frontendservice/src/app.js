import React, { lazy, Suspense } from 'react';
// Temporary SideBar Load until routing
import CoreLayoutComponent from './components/coreLayout/coreLayout'

const NavBar = lazy(() => import('./components/navbar/navbar'));
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'));


function App() {
    return (
        <div>
        <Suspense
            fallback={
            <div>
                <NavBar />
                <LinearProgress />
            </div>
            }
        ></Suspense>
        <CoreLayoutComponent />
        </div>
    );
}

export default App;
