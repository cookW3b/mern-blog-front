import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios';

export const Index = ({id, image}) => {

	const [text, setText] = useState('');

	const onSubmit = () => {
		if(text === '') return;
		const req = {
			text
		}
		try {
			axios.post(`/comments/${id}`, req)
		} catch (error) {
			alert('Не удалось оставить комментарий');
		}
	}
	console.log(text)

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={image}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
						value={text}
						onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
