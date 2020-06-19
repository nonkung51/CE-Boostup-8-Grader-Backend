import { DATA_TYPES, Model } from 'https://deno.land/x/denodb@v1.0.0/mod.ts';

class SubmissionCode extends Model {
	static table = 'submissions_code';

	static fields = {
		id: DATA_TYPES.STRING,
		userId: DATA_TYPES.STRING,
		questionId: DATA_TYPES.STRING,
		code: DATA_TYPES.STRING,
		finished: DATA_TYPES.BOOLEAN
	};

	static defaults = {
		finished: false
	}
}

export default SubmissionCode;

// (id TEXT PRIMARY KEY UNIQUE, user_id TEXT, question_id TEXT, code TEXT)
