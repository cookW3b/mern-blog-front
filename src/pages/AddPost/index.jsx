import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useSelector } from 'react-redux';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import axios from '../../axios';

export const AddPost = () => {
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const { id } = useParams();

	const [ imageUrl, setImageUrl ] = useState(null);
	const [ isLoading, setLoading ] = useState(false);
	
  const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const inputFileRef = useRef(null);
	const isEditing = Boolean(id);
  const handleChangeFile = async(e) => {
		try {
			const formData = new FormData();
			formData.append('image', e.target.files[0]);

			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
			console.log(data);
		} catch (error) {
			console.log('Ошибка загрузки данных')
		}
	};

  const onClickRemoveImage = () => {
		setImageUrl(null);
	};

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

	const onSubmit = async() => {
		try {
			setLoading(true);

			const fields = {
				title,
				imageUrl,
				text,
				tags: tags.split(',')
			};

			const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);

			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`)
		} catch (error) {
			console.warn(error);
			alert('Ошибка при создание статьи');
		}
	}

	useEffect(() => {
		if(id) {
			axios.get(`/posts/${id}`)
				.then(({data}) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(','));
				})
				.catch(err => {
					console.log(err);
					alert('Ошибка при получение статьи')
				})
		}
	}, [])
	

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

	if(!isAuth && !window.localStorage.getItem('token')){
		return <Navigate to='/'/>
	}

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
				value={title}
				onChange={(e) => setTitle(e.target.value)}
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth 
			value={tags}
			onChange={(e) => setTags(e.target.value)}/>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
