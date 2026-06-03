import React, { useEffect, useState } from 'react'
import { Container, PostForm, FormSkeleton } from '../components'
import appwriteService from '../appwrite/config1';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            setLoading(true)
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                } else {
                    navigate('/')
                }
            }).finally(() => setLoading(false))
        } else {
            navigate('/')
        }

    }, [slug, navigate])

    if (loading) {
        return (
            <div className='py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <FormSkeleton />
            </div>
        )
    }

    return post ? (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='py-8'
        >
            <Container>
                <PostForm post={post} />
            </Container>
        </motion.div>
    ) : null
}   

export default EditPost