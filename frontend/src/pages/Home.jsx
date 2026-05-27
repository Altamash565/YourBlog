import React, {useEffect, useState} from 'react'
import appwriteService from '../appwrite/config1';
import { Container, PostCard } from '../components';



function Home() {
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className='w-full text-center py-8'>
                            <p className='text-gray-500 text-lg'>No posts available at the moment</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Home