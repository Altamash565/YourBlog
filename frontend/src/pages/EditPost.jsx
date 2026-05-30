import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from '../appwrite/config1';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function EditPost() {
    const [post, setPost] = useState(null);
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        } else {
            navigate('/')
        }

    }, [slug, navigate])

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