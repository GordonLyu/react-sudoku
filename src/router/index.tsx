import { lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
const Sudoku = lazy(() => import('@/pages/sudoku'))


const routes: RouteObject[] = [{
    path: '/',
    element: <Sudoku />
}]


const router = () => {
    return useRoutes(routes)
}

export default router