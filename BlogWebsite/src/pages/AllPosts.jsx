import React, {useState, useEffect, use} from 'react'
import appwriteService from '../appwrite/config1';
import { Container, Post, PostCard } from '../components';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {}, [])
    appwriteService.getPosts([]).then((posts) => {
        if (posts) {
            setPosts(posts.documents)
        }
    })
  return (
    <div className='w-full'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => 9(
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts