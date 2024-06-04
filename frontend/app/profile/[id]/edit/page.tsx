'use client';
import * as yup from 'yup';
import { useFormik } from "formik";
import { getCSRFToken } from '@/utility';
import { useContext } from 'react';
import { context as ctx } from '@/context/context';
import { toast } from 'react-toastify';

export default function EditProfile() {
    const context = useContext(ctx);
    const formik = useFormik({
        initialValues: {
            username: '',
            email: "",
            first_name: "",
            last_name: "",
            phone: '',
        },
        validationSchema: yup.object({
            username: yup.string().max(20, "Must be 20 characters or less"),
            email: yup.string().email("Must be a valid email address."),
            first_name: yup.string(),
            last_name: yup.string(),
            phone: yup.number().positive("Must be a positive integer."),
        }),
        validateOnChange: true,
        onSubmit: async (values) => {
            const sendValues = {
                ...values,
                'id': context.user?.id
            }
            const apiToken = await getCSRFToken();
            const response = await fetch("http://localhost:8000/accounts/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": apiToken,
                } as any,
                credentials: "include",
                body: JSON.stringify(sendValues),
            });
            if (!response.ok) {
                const data = await response.json();
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
            const data = await response.json();
            context.setUser(data);
            localStorage.setItem('message', 'Profile updated successfully!');
            window.location.href = '/profile/' + context.user?.id;
        }
    });
    return (
        <form onSubmit={formik.handleSubmit} className='register-form h-[360px]'>
            <div>
                <label className='input-label' htmlFor="username">Username: </label>
                <input
                    id="username"
                    className='input-tag'
                    {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className='input-error'>{formik.errors.username}</div>
                ) : null}
            </div>
            <div>
                <label className='input-label' htmlFor="first_name">First Name: </label>
                <input
                    id="first_name"
                    className='input-tag'
                    {...formik.getFieldProps("first_name")}
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                    <div className='input-error'>{formik.errors.first_name}</div>
                ) : null}
            </div>
            <div>
                <label className='input-label' htmlFor="last_name">Last Name: </label>
                <input
                    id="last_name"
                    className='input-tag'
                    {...formik.getFieldProps("last_name")}
                />
                {formik.touched.last_name && formik.errors.last_name ? (
                    <div className='input-error'>{formik.errors.last_name}</div>
                ) : null}
            </div>
            <div>
                <label className='input-label' htmlFor="email">Email: </label>
                <input
                    id="email"
                    className='input-tag'
                    {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className='input-error'>{formik.errors.email}</div>
                ) : null}
            </div>
            <div>
                <label className='input-label' htmlFor="phone">Phone: </label>
                <input
                    id="phone"
                    className='input-tag'
                    {...formik.getFieldProps("phone")}
                />
                {formik.touched.phone && formik.errors.phone ? (
                    <div className='input-error'>{formik.errors.phone}</div>
                ) : null}
            </div>
            <div className='input-text'>None of the fields above are required.</div>
            <button type="submit" className='form-submit'>Edit</button>
        </form>
    );
}