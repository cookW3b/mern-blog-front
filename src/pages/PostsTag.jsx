import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/slices/post';

import { useParams } from 'react-router-dom';


export const PostsTag = () => {
	const userData = useSelector((state) => state.auth.data);
	const { posts } = useSelector(state => state.posts);

	const dispatch = useDispatch();

	const [isPostsLoading, setIsLoading] = useState(true);
	
	const { tag } = useParams(); 

	useEffect(() => {
		dispatch(fetchPosts(`tags/${tag}`));
		setIsLoading(false);
	}, [])
	
	console.log(posts)

	return (
		<>
			<Grid container spacing={4}>
				
					
				<Grid xs={8} item>
					<Typography mb={4} variant='h4'> 
						{`Всего статей по тэгу ${tag} найдено: ${posts.items.length}`}
					</Typography> 
							{(isPostsLoading ? [...Array(5)] : posts.items ).map((obj, index) => isPostsLoading ? ( <Post key={index} isLoading={true}/> ) : 
							(
								<Post
								id={ obj._id }
								title={obj.title}
								imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : '' }
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={obj.comments.length}
								tags={obj.tags}
								isEditable={userData?._id === obj.user._id}
							/> 
							))}
				</Grid>
			</Grid>
		</>
	)
}
