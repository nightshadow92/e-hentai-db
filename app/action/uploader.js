const ConnectDB = require('../util/connectDB');
const getResponse = require('../util/getResponse');

const uploaderList = async (req, res) => {
	let { uploader, page = 1, limit = 10 } = Object.assign({}, req.params, req.query);
	[page, limit] = [page, limit].map(e => {
		if (e <= 0) {
			return 1;
		}
		return parseInt(e, 10);
	});
	if (limit > 25) {
		return res.json(getResponse(null, 400, 'limit is too large'));
	}
	if (!uploader) {
		return res.json(getResponse(null, 400, 'uploader is not defined'));
	}

	const conn = await new ConnectDB().connect();

	const result = await conn.query(
		'SELECT * FROM gallery WHERE expunged = 0 AND uploader = ? ORDER BY posted DESC LIMIT ? OFFSET ?',
		[uploader, limit, (page - 1) * limit]
	);
	const { total } = (await conn.query('SELECT FOUND_ROWS() AS total'))[0];

	if (!result.length) {
		conn.destroy();
		return res.json(getResponse([], 200, 'success', { total }));
	}
	const gids = result.map(e => e.gid);

	const tags = await conn.query(
		'SELECT a.gid, b.name FROM gid_tid AS a INNER JOIN tag AS b ON a.tid = b.id WHERE a.gid IN (?)', [gids]
	);
	const gidTags = {};
	tags.forEach(({ gid, name }) => {
		if (!gidTags[gid]) {
			gidTags[gid] = [];
		}
		gidTags[gid].push(name);
	});
	result.forEach(e => {
		e.tags = gidTags[e.gid] || [];
	});

	conn.destroy();
	return res.json(getResponse(result, 200, 'success', { total }));
};

module.exports = uploaderList;