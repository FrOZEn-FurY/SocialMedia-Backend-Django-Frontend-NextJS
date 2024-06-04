"use client";
import { getCSRFToken } from "@/utility";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function EditPost({ params }: { params: { id: string } }) {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: yup.object({
      title: yup.string(),
      content: yup.string(),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      const apiToken = await getCSRFToken();
        const sendValues = {
            ...values,
            id: params.id
        }
      const response = await fetch(`http://localhost:8000/posts/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": apiToken,
        } as any,
        credentials: "include",
        body: JSON.stringify(sendValues),
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
        });
      }
      localStorage.setItem("message", "Post updated successfully!");
      window.location.href = "/posts/" + params.id;
    },
  });

  return (
    <form className="form h-[450px]" onSubmit={formik.handleSubmit}>
      <div>
        <label className="input-label" htmlFor="title">
          Title: 
        </label>
        <input
          id="title"
          className="input-tag w-full"
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title ? (
          <span className="input-error">{formik.errors.title}</span>
        ) : null}
      </div>
      <div>
        <label className="input-label" htmlFor="content">
          Content: 
        </label>
        <textarea
          id="content"
          className="textarea"
          {...formik.getFieldProps("content")}
        />
        {formik.touched.content && formik.errors.content ? (
          <span className="input-error">{formik.errors.content}</span>
        ) : null}
      </div>
      <span className="input-text">None of the above fields are required.</span>
      <button className="form-submit" type="submit">Submit</button>
    </form>
  );
}
