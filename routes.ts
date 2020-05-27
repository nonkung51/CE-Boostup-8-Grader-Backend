import { Router } from "https://deno.land/x/oak/mod.ts";
// import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.ts'
import { addUser, signIn } from "./controller/users.ts";

const router = new Router();

router.post("/api/v1/register", addUser)
      .post("/api/v1/login", signIn);

export default router;
