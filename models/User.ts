import { DATA_TYPES, Model } from 'https://deno.land/x/denodb@v1.0.0/mod.ts';

class User extends Model {
	static table = 'users';

	static fields = {
		id: DATA_TYPES.STRING,
		username: DATA_TYPES.STRING,
		password: DATA_TYPES.STRING,
		nickname: DATA_TYPES.STRING,
		token: DATA_TYPES.STRING,
		score: DATA_TYPES.INTEGER,
	};

	static defaults = {
		score: 0,
		nickname: 'anonymous'
	};
}

export default User;
