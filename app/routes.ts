import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("./routes/home.tsx"),
    route("/login", "./routes/login.tsx"),
    route("/posts", "./routes/posts.tsx"),
    route("/posts/:id", "./routes/post-detail.tsx"),
  ]),
] satisfies RouteConfig;
