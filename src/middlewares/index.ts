import validateBody from "./validateBody.middlewares";
import handleError from "./handleError.middlewares";
import verifyToken from "./verifyToken.middlewares";
import verifyUserPermission from "./verifyUserPermission.middlewares";
/* import pagination from "./pagination.middleware"; */
import verifyOwnership from "./verifyOwnership.middleware";

export default {
  validateBody,
  handleError,
  verifyToken,
  verifyUserPermission,
  verifyOwnership,
};
