import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from '../axios';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import ReactMarkdown from 'react-markdown'


export const FullPost = () => {
	const [data, setData] = useState();
	const [isLoading, setLoading] = useState(true);
	const { id } = useParams();

	const [comments, setComments] = useState();
	const [checkComments, setCheckComments] = useState(0);

	const token = window.localStorage.getItem('token');

	useEffect(() => {
		if(isLoading) {
			axios
			.get(`/posts/${id}`)
			.then(res => {
				setData(res.data);
				setLoading(false);
				setComments(res.data.comments)
			})
			.catch((err) => {
				console.log(err);
				alert('Не удалось получиь статью');
			});
		} else {
			axios
				.get(`comments/${id}`)
				.then(res => {
					setComments(res.data.comments)
				})
		}
		

	}, [checkComments])
	if(isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items = {	comments ? comments.map((item) => {
					return {
						user: {
							fullName: item.userName,
							avatarUrl: item.avatarUrl
						},
						text: item.text
					}
				}) : []}
        isLoading={isLoading}
      >
				{ token && (<Index id={id} comments={checkComments} setComments={setCheckComments} image={data.user.avatarUrl} />) }
      </CommentsBlock>
    </>
  );
};
