import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/post';
import axios from '../axios';

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);
	const [ tab, setTab ] = useState(0)

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	React.useEffect(() => {
		if(tab === 0) {
			dispatch(fetchPosts('new'));
		}else{
			dispatch(fetchPosts('popular'));
		}
		dispatch(fetchTags());
	}, [tab])

	const handleChange = () => {
		setTab(() => {
			if( tab === 0){
				return 1;
			}else {
				return 0;
			}
		})
	};

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} onChange={handleChange} value={tab} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items ).map((obj, index) => isPostsLoading ? ( <Post key={index} isLoading={true}/> ) : 
					(
						<Post
						id={ obj._id }
						title={obj.title}
						imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : '' }
						user={obj.user}
						createdAt={obj.createdAt}
						viewsCount={obj.viewsCount}
						commentsCount={3}
						tags={obj.tags}
						isEditable={userData?._id === obj.user._id}
					/> 
          ))}
        </Grid>
        <Grid xs={4} item>
        </Grid>
      </Grid>
    </>
  );
};
