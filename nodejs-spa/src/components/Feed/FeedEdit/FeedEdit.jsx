import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Folder/Input/Input';
import FilePicker from '../../Folder/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';
import {useState, useEffect} from 'react';


const POST_FORM = {
    title: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
    },
    image: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
    },
    content: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
    }
};

const FeedEdit = ({editing, selectedPost, onCancelEdit, onFinishEdit }) => {
    const [post, setPostForm] = useState({
        postForm: POST_FORM,
        formIsValid: false,
        imagePreview: null
    });

    useEffect(() => {
        if (editing && selectedPost) {
            const updatedForm = {
                title: {
                    ...post.postForm.title,
                    value: selectedPost.title,
                    valid: true
                },
                image: {
                    ...post.postForm.image,
                    value: selectedPost.imagePath,
                    valid: true
                },
                content: {
                    ...post.postForm.content,
                    value: selectedPost.content,
                    valid: true
                }
            };
            setPostForm({ postForm: updatedForm, formIsValid: true, imagePreview: post.imagePreview });
        }
    }, [editing, selectedPost]);

    const postInputChangeHandler = (input, value, files) => {
        if (files) {
            generateBase64FromImage(files[0])
                .then(b64 => {
                    setPostForm( prevState=>({...prevState, imagePreview: b64 }));
                })
                .catch(e => {
                    setPostForm( prevState =>({...prevState, imagePreview: null }));
                });
        }
        setPostForm(prevState => {
            let isValid = true;
            for (const validator of prevState.postForm[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.postForm,
                [input]: {
                    ...prevState.postForm[input],
                    valid: isValid,
                    value: files ? files[0] : value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                ...prevState,
                postForm: updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    const  inputBlurHandler = input => {
        setPostForm(prevState => {
            return {
                ...prevState,
                postForm: {
                    ...prevState.postForm,
                    [input]: {
                        ...prevState.postForm[input],
                        touched: true
                    }
                }
            };
        });
    };

    const cancelPostChangeHandler = () => {
        setPostForm( prevState =>({
            ...prevState,
            postForm: POST_FORM,
            formIsValid: false
        }));
        onCancelEdit();
    };

    const acceptPostChangeHandler = () => {
        const newPost = {
            title: post.postForm.title.value,
            image: post.postForm.image.value,
            content: post.postForm.content.value
        };
        onFinishEdit(newPost);
        setPostForm(prevState =>({
            ...prevState,
            postForm: POST_FORM,
            formIsValid: false,
            imagePreview: null
        }));
    };


    return (
        editing ? (
            <>
                <Backdrop onClick={cancelPostChangeHandler} />
                <Modal
                    title="New Post"
                    acceptEnabled={post.formIsValid}
                    onCancelModal={cancelPostChangeHandler}
                    onAcceptModal={acceptPostChangeHandler}
                    isLoading={loading}
                >
                    <form>
                        <Input
                            id="title"
                            label="Title"
                            control="input"
                            onChange={postInputChangeHandler}
                            onBlur={inputBlurHandler.bind(this, 'title')}
                            valid={post.postForm['title'].valid}
                            touched={post.postForm['title'].touched}
                            value={post.postForm['title'].value}
                        />
                        <FilePicker
                            id="image"
                            label="Image"
                            control="input"
                            onChange={postInputChangeHandler}
                            onBlur={inputBlurHandler.bind(this, 'image')}
                            valid={post.postForm['image'].valid}
                            touched={post.postForm['image'].touched}
                        />
                        <div className="new-post__preview-image">
                            {!post.imagePreview && <p>Please choose an image.</p>}
                            {post.imagePreview && (
                                <Image imageUrl={post.imagePreview} contain left />
                            )}
                        </div>
                        <Input
                            id="content"
                            label="Content"
                            control="textarea"
                            rows="5"
                            onChange={postInputChangeHandler}
                            onBlur={inputBlurHandler.bind(this, 'content')}
                            valid={post.postForm['content'].valid}
                            touched={post.postForm['content'].touched}
                            value={post.postForm['content'].value}
                        />
                    </form>
                </Modal>
            </>
        ) : null
    )
}

export default FeedEdit;
