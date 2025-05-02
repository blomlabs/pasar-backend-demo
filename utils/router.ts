import { readdirSync } from "fs";
import { join } from "path";
import { Route } from "zoltra";

export function getRouteBasePath(
  routeDir: string,
  isTypeScript: boolean = true
): string[] {
  const filePattern = isTypeScript ? /\.(js|ts)$/ : /\.js$/;
  const excludePattern = /^(index|\.test|\.spec)\.(js|ts)$/;

  const routeItems = readdirSync(routeDir, { withFileTypes: true });

  return routeItems.flatMap((item) => {
    if (
      item.isFile() &&
      filePattern.test(item.name) &&
      !excludePattern.test(item.name)
    ) {
      return [item.name.replace(/\.(js|ts)$/, "")];
    } else if (item.isDirectory()) {
      const subDir = join(routeDir, item.name);
      const subFiles = readdirSync(subDir, "utf-8")
        .filter((file) => filePattern.test(file) && !excludePattern.test(file))
        .map((file) => `${item.name}/${file.replace(/\.(js|ts)$/, "")}`);

      const subDirs = readdirSync(subDir, { withFileTypes: true })
        .filter((subItem) => subItem.isDirectory())
        .flatMap((subItem) => {
          const nestedPaths = getRouteBasePath(
            join(subDir, subItem.name),
            isTypeScript
          );
          return nestedPaths.map((path) => `${item.name}/${path}`);
        });

      return [...subFiles, ...subDirs];
    }
    return [];
  });
}

// Improved version that clones handlers properly
export function prefixRoutesWithBasePath(
  routes: Route[],
  basePath: string
): Route[] {
  if (!basePath) return routes;

  return routes.map((route) => {
    if (!route.path) return route;

    const cleanBase = basePath.replace(/^\/|\/$/g, "");
    const cleanPath = route.path.replace(/^\//, "");

    return {
      //   ...structuredClone(route),
      ...route,
      path: `/${[cleanBase, cleanPath].filter(Boolean).join("/")}`.replace(
        /\/+/g,
        "/"
      ),
    };
  });
}

export function processRoutes(routes: Route[], basePaths: string[]): Route[] {
  return routes.flatMap((route) => {
    // Return original route for non-versioned paths
    return basePaths.map((basePath) => ({
      ...route,
      handler: (...args: Parameters<typeof route.handler>) =>
        route.handler(...args), // Clone handler
      path: `/${basePath}`.replace(/\/+/g, "/"),
    }));
  });
}
