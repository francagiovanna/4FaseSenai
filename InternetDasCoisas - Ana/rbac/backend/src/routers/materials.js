import {Router} from "express"; 
import {lista, deleta} from "../controllers/materials.js"; 
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

//Autenticação: todas as rotas abaixo exigem token
routermaterials.use(authenticate);

routerMaterials.get("/", lista);

routerMaterials.delete("/:id", requireRole("admin"), deleta);

export default routerMaterials