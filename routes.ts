import { Router } from "https://deno.land/x/oak/mod.ts";
// import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.ts'
import { addUser } from "./controller/users.ts";

const router = new Router();

router.post("/api/v1/register", addUser);

export default router;
