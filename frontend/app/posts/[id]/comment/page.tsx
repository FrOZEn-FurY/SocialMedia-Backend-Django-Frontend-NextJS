'use client'
import { context as ctx} from "@/context/context";
import { getCSRFToken } from "@/utility";
import { useFormik } from "formik"
import { useContext } from "react";
import { toast } from "react-toastify";
import * as yup from 'yup';

export default function Comment({params}: {params: {id: string}}) {
    const context = useContext(ctx);
    const formik = useFormik({
        initialValues: {
            content: "",
        },
        onSubmit: async (values) => {
            const apiToken = await getCSRFToken();
            const sendData = {
                ...values,
                'author': context.user?.id,
                'post': params.id
            }
            const response = await fetch("http://localhost:8000/posts/comments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": apiToken,
                } as any,
                credentials: "include",
                body: JSON.stringify(sendData),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
                return;
            }
            localStorage.setItem('message', 'Comment created successfully!');
            window.location.replace(`/posts/${params.id}`);
        },
        validationSchema: yup.object({
            content: yup.string().required("Required").max(200, "Must be 200 characters or less").min(2, "Must be 2 characters or more"),
        }),
        validateOnChange: true,
    });

    return (
        <div>
            <form className="register-form" onSubmit={formik.handleSubmit}>
                <label className="input-label" htmlFor="content">Content: </label>
                <textarea
                    id="content"
                    className="textarea h-[300px] block"
                    {...formik.getFieldProps("content")}
                />
                {formik.touched.content && formik.errors.content ? <span className="input-error">{formik.errors.content}</span> : null}
                <button className="form-submit" type="submit">Submit</button>
            </form>
        </div>
    )
}