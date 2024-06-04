"use client";
import { context as ctx } from "@/context/context";
import { getCSRFToken } from "@/utility";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function CreatePost() {
  const context = useContext(ctx);
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    onSubmit: async (values) => {
      const apiToken = await getCSRFToken();
      const sendData = {
        ...values,
        author: context.user?.id,
      };
      const response = await fetch("http://localhost:8000/posts/", {
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
      localStorage.setItem("message", "Post created successfully!");
      window.location.href = "/";
    },
    validationSchema: yup.object({
      title: yup
        .string()
        .required("Required")
        .max(255, "Must be 255 characters or less"),
      content: yup.string().required("Required"),
    }),
  });
  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <label className="input-label" htmlFor="title">
        Title:{" "}
      </label>
      <Tooltip
        title="Try to make a title that describes the content of the post, not so long, and effcient."
        position="top"
        trigger="mouseenter"
        arrow={true}
      >
        <input
          id="title"
          className="input-tag w-full"
          {...formik.getFieldProps("title")}
        />
      </Tooltip>
      {formik.touched.title && formik.errors.title ? (
        <span className="input-error">{formik.errors.title}</span>
      ) : (
        <span className="input-text">Must be 255 characters or less.</span>
      )}
      <label className="input-label" htmlFor="content">
        Content:{" "}
      </label>
      <Tooltip
        title="Content of your post, try to make it as informative as possible."
        position="top"
        trigger="mouseenter"
        arrow={true}
      >
        <textarea
          className="textarea"
          id="content"
          {...formik.getFieldProps("content")}
        />
      </Tooltip>
      {formik.touched.content && formik.errors.content ? (
        <span className="input-error">{formik.errors.content}</span>
      ) : null}
      <button className="form-submit" type="submit">
        Submit
      </button>
    </form>
  );
}
