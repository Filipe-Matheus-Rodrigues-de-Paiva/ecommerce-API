import "express-async-errors";
import express, { Application } from "express";
import routes from "./routes";
import middlewares from "./middlewares";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";

const app: Application = express();
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/announcements", routes.announcementRoutes);
app.use("/users", routes.userRoutes);
app.use("/address", routes.addressRoutes);
app.use("/login", routes.sessionRoutes);
app.use("/comments", routes.commentRoutes);

app.use(middlewares.handleError);

export default app;
