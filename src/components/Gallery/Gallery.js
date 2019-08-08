import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import fileSize from '../../util/fileSize';
import styles from './Gallery.css';
import { categoryNameMap } from '../../util/category';
import Rating from '../Rating';
import parseEntity from '../../util/parseEntity';

const Gallery = ({
	thumb, category, uploader, posted, expunged, filesize, filecount,
	title, title_jpn, rating, tags = [], gid, token, onSearch = () => {}
}) => {
	const tagList = {};
	tags.forEach(e => {
		const [type, name] = ['misc'].concat(e.split(':', 2)).slice(-2);
		if (!tagList[type]) {
			tagList[type] = [];
		}
		tagList[type].push(name);
	});

	return (
		<div className={styles.container}>
			<div className={styles.coverWrap}>
				<img src={thumb.replace(/_l\./, '_250.')} className={styles.cover} />
			</div>
			<div className={styles.meta}>
				<div className={styles.metaSingleItem}>
					<div
						className={styles.category}
						style={{ background: categoryNameMap[category].color }}
						onClick={() => onSearch({ category: categoryNameMap[category].value })}>
						{category}
					</div>
				</div>
				<div className={styles.metaSingleItem}>
					<a onClick={() => onSearch({ keyword: `uploader:${uploader}` })}>
						{uploader}
					</a>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Gallery ID:</span>
					<span className={styles.metaValue}>
						{gid}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Token:</span>
					<span className={styles.metaValue}>
						{token}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Posted:</span>
					<span className={styles.metaValue}>
						{moment(posted * 1000).format('YYYY-MM-DD HH:mm:ss')}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Expunged:</span>
					<span className={styles.metaValue}>
						{expunged ? 'Yes' : 'No'}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>File Size:</span>
					<span className={styles.metaValue}>
						{fileSize(filesize)}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>File Length:</span>
					<span className={styles.metaValue}>
						{filecount}
						{' '}
						{filecount > 1 ? 'pages' : 'page'}
					</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Rating:</span>
					<span className={styles.metaValue}>
						<Rating value={rating} />
						{rating}
					</span>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						{parseEntity(title)}
					</h2>
					<h3 className={styles.subtitle}>
						{parseEntity(title_jpn)}
					</h3>
				</div>
				<div className={styles.tags}>
					{Object.entries(tagList).map(([type, list]) => (
						<div className={styles.tagLine} key={type}>
							<div className={styles.tagType}>{type}:</div>
							<div className={styles.tagList}>
								{list.map(tag => (
									<a
										key={tag}
										onClick={() => onSearch({
											keyword: type === 'misc'
												? tag :
												`${type}:${/\s/.test(tag) ? `"${tag}$"` : `${tag}$`}`
										})}>
										{tag}
									</a>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default withRouter(Gallery);