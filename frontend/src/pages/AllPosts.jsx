import React, { useState, useEffect } from 'react'
import appwriteService from '../appwrite/config1';
import { Container, PostCard } from '../components';

import { motion } from 'framer-motion'

function AllPosts() {
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='w-full py-12'
        >
            <Container>
                <div className='mb-10 text-center md:text-left'>
                    <h1 className='text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50'>
                        All Publications
                    </h1>
                    <p className='mt-2 text-base text-zinc-500 dark:text-zinc-400'>
                        Explore the complete library of written content and tutorials.
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {posts.length > 0 ? (
                        posts.map((post, idx) => (
                            <motion.div
                                key={post.$id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <PostCard {...post} />
                            </motion.div>
                        ))
                    ) : (
                        <div className='col-span-full text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl'>
                            <p className='text-zinc-500 dark:text-zinc-400 text-lg'>No posts available</p>
                        </div>
                    )}
                </div>
            </Container>
        </motion.div>
    )
}

export default AllPosts