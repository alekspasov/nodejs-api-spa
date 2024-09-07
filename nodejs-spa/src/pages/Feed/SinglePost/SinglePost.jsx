import Image from '../../../components/Image/Image';
import './SinglePost.css';
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const SinglePost  = () => {
    const [post, setPost ] = useState({
        title: '',
        author: '',
        date: '',
        image: '',
        content: ''
    })

    const {postId} = useParams();

    useEffect(() => {
        fetch('URL')
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch status');
                }
                return res.json();
            })
            .then(resData => {
                setPost( prevState =>({
                    ...prevState,
                    title: resData.post.title,
                    author: resData.post.creator.name,
                    date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
                    content: resData.post.content
                }));
            })
            .catch(err => {
                console.log(err);
            });
    }, [postId]);


    return (
        <section className="single-post">
            <h1>{this.state.title}</h1>
            <h2>
                Created by {post.author} on {post.date}
            </h2>
            <div className="single-post__image">
                <Image contain imageUrl={post.image}/>
            </div>
            <p>{post.content}</p>
        </section>
    )

}


export default SinglePost;