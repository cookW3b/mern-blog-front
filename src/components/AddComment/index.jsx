import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios';

export const Index = ({id, image, setComments, comments}) => {

	const [text, setText] = useState('');

	const onSubmit = async () => {
		if(text === '') return;
		const req = {
			text
		}
		try {
			await axios.post(`/comments/${id}`, req);
			setComments(!comments)
			setText('');
		} catch (error) {
			alert('Не удалось оставить комментарий');
		}
	}


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
