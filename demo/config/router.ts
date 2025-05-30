import { DynoRouteConfig } from '../../core/typings'

 const routesConfig: DynoRouteConfig[] = [
    {
        path: '/',
        routes: [
            {
                path: '/',
                redirect: '/home',    // 仍然保留重定向
            },
            {
                path: '/home',
                name: '关于',
                component: './pages/Home'
            },
            {
                path: '/about',
                name: '关于',
                component: './pages/About'
            },
        ]
      },
   
]

export default routesConfig