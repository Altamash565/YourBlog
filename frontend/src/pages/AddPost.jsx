import React from 'react'
import { Container, PostForm } from '../components'
import { motion } from 'framer-motion'

function AddPost() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='py-8'
    >
        <Container>
            <PostForm />
        </Container>
    </motion.div>
  )
}

export default AddPost