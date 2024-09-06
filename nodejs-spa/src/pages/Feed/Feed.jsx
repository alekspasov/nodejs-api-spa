import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Folder/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';


import {useState, useEffect} from 'react';


const Feed = ({}) => {
    const [feedData, setFeedData] = useState({
        isEditing: false,
        posts: [],
        totalPosts: 0,
        editPost: null,
        status: '',
        postPage: 1,
        postsLoading: true,
        editLoading: false
    })

    useEffect (() => {
        fetch('URL')
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch user status.');
                }
                return res.json();
            })
            .then(resData => {
                setFeedData({...feedData, status: resData.status });
            })
            .catch(catchError);

        loadPosts();
    },[])

    const loadPosts = direction => {
        if (direction) {
            setFeedData({...feedData, postsLoading: true, posts: [] });
        }
        let page = feedData.postPage;
        if (direction === 'next') {
            page++;
            setFeedData({ ...feedData, postPage: page });
        }
        if (direction === 'previous') {
            page--;
            setFeedData({ ...feedData,postPage: page });
        }
        fetch('URL')
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch posts.');
                }
                return res.json();
            })
            .then(resData => {
                setFeedData({
                    ...feedData,
                    posts: resData.posts,
                    totalPosts: resData.totalItems,
                    postsLoading: false
                });
            })
            .catch(catchError);
    };

    const statusUpdateHandler = event => {
            event.preventDefault();
            fetch('URL')
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
        setFeedData({...feedData, isEditing: true });
    };

    const startEditPostHandler = postId => {
        setFeedData(prevState => {
            const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

            return {
                ...prevState,
                isEditing: true,
                editPost: loadedPost
            };
        });
    };

    const cancelEditHandler = () => {
        setFeedData({...feedData, isEditing: false, editPost: null });
    };

    const  finishEditHandler = postData => {
        setFeedData({
            ...feedData,
            editLoading: true
        });
        // Set up data (with image!)
        let url = 'URL';
        if (feedData.editPost) {
            url = 'URL';
        }

        fetch(url)
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Creating or editing a post failed!');
                }
                return res.json();
            })
            .then(resData => {
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
                        isEditing: false,
                        editPost: null,
                        editLoading: false
                    };
                });
            })
            .catch(err => {
                console.log(err);
                setFeedData({
                    ...feedData,
                    isEditing: false,
                    editPost: null,
                    editLoading: false,
                    error: err
                });
            });
    };

    const statusInputChangeHandler = (input, value) => {
        setFeedData({...feedData, status: value });
    };

    const  deletePostHandler = postId => {
        setFeedData({...feedData, postsLoading: true });
        fetch('URL')
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
                    return {...prevState, posts: updatedPosts, postsLoading: false };
                });
            })
            .catch(err => {
                console.log(err);
                setFeedData({...feedData, postsLoading: false });
            });
    };

    const errorHandler = () => {
        setFeedData({...feedData, error: null });
    };

    const catchError = error => {
        setFeedData({...feedData, error: error });
    };

    return (
        <>
            <ErrorHandler error={feedData.error} onHandle={errorHandler} />
            <FeedEdit
                editing={feedData.isEditing}
                selectedPost={feedData.editPost}
                loading={feedData.editLoading}
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
                <Button mode="raised" design="accent" onClick={newPostHandler}>
                    New Post
                </Button>
            </section>
            <section className="feed">
                {feedData.postsLoading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Loader />
                    </div>
                )}
                {feedData.posts.length <= 0 && !feedData.postsLoading ? (
                    <p style={{ textAlign: 'center' }}>No posts found.</p>
                ) : null}
                {!feedData.postsLoading && (
                    <Paginator
                        onPrevious={loadPosts.bind('previous')}
                        onNext={loadPosts.bind( 'next')}
                        lastPage={Math.ceil(feedData.totalPosts / 2)}
                        currentPage={feedData.postPage}
                    >
                        {feedData.posts.map(post => (
                            <Post
                                key={post._id}
                                id={post._id}
                                author={post.creator.name}
                                date={new Date(post.createdAt).toLocaleDateString('en-US')}
                                title={post.title}
                                image={post.imageUrl}
                                content={post.content}
                                onStartEdit={startEditPostHandler.bind(post._id)}
                                onDelete={deletePostHandler.bind( post._id)}
                            />
                        ))}
                    </Paginator>
                )}
            </section>
        </>
    );
}
export default Feed;