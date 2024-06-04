"use client";
import { context as ctx } from "@/context/context";
import { getCSRFToken } from "@/utility";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Flip, toast } from "react-toastify";
import * as yup from "yup";

export default function Login() {
  const router = useRouter();
  const context = useContext(ctx);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email address").required("Required"),
      password: yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const apiToken = await getCSRFToken();
      console.log(apiToken);
      const response = await fetch("http://localhost:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Csrftoken": apiToken,
        } as any,
        credentials: "include",
        body: JSON.stringify(values),
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
          transition: Flip,
        });
        return;
      }
      toast.success("Loged in successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      const user: {
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
        followings: {
        	id: number;
        	username: string;
        }[]
      } = {
        id: data.id,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        followings: data.followings
      }
      context.setUser(user);
      router.push("/");
    },
  });
  return (
    <>
      <form className="register-form h-[350px]" onSubmit={formik.handleSubmit}>
        <label htmlFor="email" className="input-label">
          Email:{" "}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="input-tag w-full"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="input-error">{formik.errors.email}</div>
        ) : null}
        <label htmlFor="password" className="input-label">
          Password:{" "}
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className="input-tag w-full"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="input-error">{formik.errors.password}</div>
        ) : null}
        <div className="flex flex-row">
          <button type="submit" className="form-submit inline me-auto">
            Login
          </button>
          <label htmlFor="showPassword" className="input-label pt-[14px]">
            Show Password:{" "}
          </label>
          <input
            className="mt-2"
            type="checkbox"
            onClick={() => setShowPassword(!showPassword)}
            checked={showPassword}
            id="showPassword"
          />
        </div>
      </form>
    </>
  );
}
