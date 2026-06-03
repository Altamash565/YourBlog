import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config1";
import { Button, Container, PostDetailSkeleton } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            }).finally(() => {
                setLoading(false);
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    if (loading) {
        return (
            <div className="py-12 px-4 max-w-4xl mx-auto w-full">
                <PostDetailSkeleton />
            </div>
        );
    }

    return post ? (
        <motion.article 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-12 px-4 max-w-4xl mx-auto"
        >
            <Container>
                
                {/* Author Options Bar */}
                {isAuthor && (
                    <div className="flex justify-end gap-3 mb-6">
                        <Link to={`/edit-post/${post.slug || post.$id}`}>
                            <Button variant="outline" className="text-sm font-semibold">
                                Edit Post
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={deletePost} className="text-sm font-semibold">
                            Delete Post
                        </Button>
                    </div>
                )}

                {/* Article Header */}
                <header className="mb-8 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        <span>Published Article</span>
                        <span>•</span>
                        <span>5 min read</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                        {post.title}
                    </h1>
                </header>

                {/* Featured Image */}
                <div className="w-full overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg mb-10 bg-zinc-100 dark:bg-zinc-900">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-auto max-h-[480px] object-cover"
                    />
                </div>

                {/* Article Body */}
                <div className="max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed text-base space-y-4">
                    {parse(post.content)}
                </div>

            </Container>
        </motion.article>
    ) : null;
}

