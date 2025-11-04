import { Router } from "express";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/",
    route: router,
  },
];

for (const route of moduleRoutes) {
  router.use(route.path, route.route);
}

export default router;
