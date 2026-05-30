import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 pl-0.5 select-none">
                    {label}
                </label>
            )}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Editor
                        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                        value={value ?? defaultValue}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "help",
                                "wordcount",
                            ],
                            toolbar: [
                                'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
                                'preview media | forecolor backcolor emoticons | help'
                            ],
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}

