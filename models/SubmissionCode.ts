import { DATA_TYPES, Model } from 'https://deno.land/x/denodb/mod.ts';

class SubmissionCode extends Model {
	static table = 'submissions_code';

	static fields = {
		id: DATA_TYPES.STRING,
		userId: DATA_TYPES.STRING,
		questionId: DATA_TYPES.STRING,
		code: DATA_TYPES.STRING,
	};
}

export default SubmissionCode;

// (id TEXT PRIMARY KEY UNIQUE, user_id TEXT, question_id TEXT, code TEXT)
