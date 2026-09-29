import {Router} from "express"; 
import {login} from "../controllers/auth.js"; 
import {register} from "../controllers/register.js";

const router = Router();

//Rotas Publicas porque não há 
router.post("/login", login);
router.post("/register", register);

export default router;