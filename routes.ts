import { Router } from "https://deno.land/x/oak/mod.ts";
import { addUser, signIn } from "./controller/users.ts";
import { addQuestion, getQuestions, toggleQuestions } from './controller/questions.ts';

const router = new Router();

router.post("/api/v1/register", addUser)
	.post("/api/v1/login", signIn)
	.post("/api/v1/admin/lkmsicksanskc2213osi", addQuestion) // no secure at all ;-;
	.get("/api/v1/questions", getQuestions)
	.put("/api/v1/admin/skacmkmscaskmcs213", toggleQuestions);

export default router;
