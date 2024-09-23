import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Folder/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';


import {useState, useEffect} from 'react';


const Feed = ({userId, token}) => {
    const [feedData, setFeedData] = useState({
        posts: [],
        totalPosts: 0,
        editPost: null,
        status: '',
        postPage: 1,
    })
    const [isEditing, setIsEditing] = useState(false);
    const [postsLoading, setPostsLoading] = useState(true);


    useEffect (() => {
        fetch('http://localhost:8080/auth/status',{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch user status.');
                }
                return res.json();
            })
            .then(resData => {
                setFeedData( prevState=>({...prevState, status: resData.status }));
            })
            .catch(catchError);

        loadPosts();
    },[])

    const loadPosts = direction => {
        if (direction) {
            setFeedData( prevState=>({...prevState, posts: [] }));
            setPostsLoading(true);
        }
        let page = feedData.postPage;
        if (direction === 'next') {
            page++;
            setFeedData(prevState=>({...prevState, postPage: page }));
        }
        if (direction === 'previous') {
            page--;
            setFeedData(prevState=>({...prevState,postPage: page }));
        }
        fetch('http://localhost:8080/feed/posts?page=' + page, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch posts.');
                }
                return res.json();
            })
            .then(resData => {
                setFeedData( prevState=>({
                    ...prevState,
                    posts: resData.posts.map(post=> {
                        return {
                            ...post,
                            imagePath: post.imageUrl
                        }
                    }),
                    totalPosts: resData.totalItems,
                }));
                setPostsLoading(false);
            })
            .catch(catchError);
    };

    const statusUpdateHandler = event => {
            event.preventDefault();
            fetch('http://localhost:8080/auth/status',{
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({status: feedData.status}),
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error("Can't update status!");
                    }
                    return res.json();
                })
                .then(resData => {
                    console.log(resData);
                })
                .catch(catchError);
        };

    const newPostHandler = () => {
        setIsEditing(true);
    };

    const startEditPostHandler = postId => {
        console.log(postId);
        setFeedData(prevState => {
            const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

            return {
                ...prevState,
                editPost: loadedPost
            };
        });
        setIsEditing(true);
    };

    const cancelEditHandler = () => {
        setFeedData( prevState=>({...prevState, editPost: null }));
        setIsEditing(false);
    };

    const  finishEditHandler = postData => {
        setFeedData( prevState=>({
            ...prevState,
            editLoading: true
        }));
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('image', postData.image);

        let url = 'http://localhost:8080/feed/post';
        let method = 'POST';
        if (feedData.editPost) {
            url = 'http://localhost:8080/feed/post/' + feedData.editPost._id;
            method= 'PUT';
        }

        fetch(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            method: method,
            body: formData,
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Creating or editing a post failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                const post = {
                    _id: resData.post._id,
                    title: resData.post.title,
                    content: resData.post.content,
                    creator: resData.post.creator,
                    createdAt: resData.post.createdAt
                };
                setFeedData(prevState => {
                    let updatedPosts = [...prevState.posts];
                    if (prevState.editPost) {
                        const postIndex = prevState.posts.findIndex(
                            p => p._id === prevState.editPost._id
                        );
                        updatedPosts[postIndex] = post;
                    } else if (prevState.posts.length < 2) {
                        updatedPosts = prevState.posts.concat(post);
                    }
                    return {
                        ...prevState,
                        posts: updatedPosts,
                        editPost: null,
                        editLoading: false
                    };
                });
                setIsEditing(false);
            })
            .catch(err => {
                console.log(err);
                setFeedData( prevState=>({
                    ...prevState,
                    editPost: null,
                    editLoading: false,
                    error: err
                }));
                setIsEditing(false);
            });
    };

    const statusInputChangeHandler = (input, value) => {
        setFeedData( prevState=>({...prevState, status: value }));
    };

    const  deletePostHandler = postId => {
        setPostsLoading(true);
        console.log(postId);
        fetch('http://localhost:8080/feed/post/' + postId, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Deleting a post failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                setFeedData(prevState => {
                    const updatedPosts = prevState.posts.filter(p => p._id !== postId);
                    return {...prevState, posts: updatedPosts};
                });
                setPostsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setPostsLoading(false);
            });
    };

    const errorHandler = () => {
        setFeedData( prevState=>({...prevState, error: null }));
    };

    const catchError = error => {
        setFeedData( prevState=>({...prevState, error: error }));
    };

    return (
        <>
            <ErrorHandler error={feedData.error} onHandle={errorHandler} />
            <FeedEdit
                editing={isEditing}
                selectedPost={feedData.editPost}
                loading={postsLoading}
                onCancelEdit={cancelEditHandler}
                onFinishEdit={finishEditHandler}
            />
            <section className="feed__status">
                <form onSubmit={statusUpdateHandler}>
                    <Input
                        type="text"
                        placeholder="Your status"
                        control="input"
                        onChange={statusInputChangeHandler}
                        value={feedData.status}
                    />
                    <Button mode="flat" type="submit">
                        Update
                    </Button>
                </form>
            </section>
            <section className="feed__control">
                <Button mode="raised" design="accent" onClick={()=>newPostHandler()}>
                    New Post
                </Button>
            </section>
            <section className="feed">
                {postsLoading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Loader />
                    </div>
                )}
                {feedData.posts.length <= 0 && !postsLoading ? (
                    <p style={{ textAlign: 'center' }}>No posts found.</p>
                ) : null}
                {!postsLoading && (
                    <Paginator
                        onPrevious={()=>loadPosts('previous')}
                        onNext={()=>loadPosts( 'next')}
                        lastPage={Math.ceil(feedData.totalPosts / 2)}
                        currentPage={feedData.postPage}
                    >
                        {feedData.posts.map(post => (
                            <Post
                                key={post._id}
                                id={post._id}
                                date={new Date(post.createdAt).toLocaleDateString('en-US')}
                                author={post.creator.name}
                                title={post.title}
                                image={post.imageUrl}
                                content={post.content}
                                onStartEdit={()=>startEditPostHandler(post._id)}
                                onDelete={()=>deletePostHandler(post._id)}
                            />
                        ))}
                    </Paginator>
                )}
            </section>
        </>
    );
}
export default Feed;