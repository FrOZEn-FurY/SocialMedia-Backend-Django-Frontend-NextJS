"use client";
import { getCSRFToken } from "@/utility";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flip, toast } from "react-toastify";
import * as yup from "yup";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email address").required("Required"),
      username: yup
        .string()
        .required("Required")
        .max(20, "Must be 20 characters or less"),
      firstName: yup.string().required("Required"),
      lastName: yup.string().required("Required"),
      password: yup
        .string()
        .required("Required")
        .max(20, "Must be 20 characters or less")
        .min(8, "Must be 8 characters or more"),
      confirmPassword: yup
        .string()
        .required("Required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      phone: yup.number().integer(),
    }),
    validateOnChange: true,
    validate: (values) => {
      let errors: {
        username?: string;
        password?: string;
      } = {};
      for (let chars of values.username) {
        if (chars === " ") {
          errors.username = "Username cannot contain spaces";
        }
      }
      let capital = false,
        small = false,
        number = false;
      for (let chars of values.password) {
        if (chars === " ") {
          errors.password = "Password cannot contain spaces";
        }
        if (chars >= "A" && chars <= "Z") {
          capital = true;
        }
        if (chars >= "a" && chars <= "z") {
          small = true;
        }
        if (chars >= "0" && chars <= "9") {
          number = true;
        }
      }
      if (!capital || !small || !number) {
        errors.password =
          "Password must contain at least one uppercase, one lowercase, and one number";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const apiToken = await getCSRFToken();
      const response = await fetch("http://localhost:8000/accounts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": apiToken,
        } as any,
        credentials: "include",
        body: JSON.stringify(values),
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
          transition: Flip,
        });
        return;
      }
      toast.success("Registered successfully!", {
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
      router.replace("/login");
    },
  });

  return (
    <>
      <form className="register-form" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email" className="input-label">
            *Email:{" "}
          </label>
          <input
            id="email"
            className="input-tag"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <span className="input-error">{formik.errors.email}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="username" className="input-label">
            *Username:{" "}
          </label>
          <input
            id="username"
            className="input-tag"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <span className="input-error">{formik.errors.username}</span>
          ) : (
            <span className="input-text">must not cotain spaces.</span>
          )}
        </div>
        <div>
          <label htmlFor="firstName" className="input-label inline">
            *First Name:{" "}
          </label>
          <input
            id="firstName"
            className="input-tag inline"
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <span className="input-error">{formik.errors.firstName}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className="input-label">
            *Last Name:{" "}
          </label>
          <input
            id="lastName"
            className="input-tag inline"
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <span className="input-error">{formik.errors.lastName}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="password" className="input-label">
            *Password:{" "}
          </label>
          <input
            id="password"
            className="input-tag inline"
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <span className="input-error">{formik.errors.password}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="input-label">
            *Confirm Password:{" "}
          </label>
          <input
            id="confirmPassword"
            className="input-tag inline"
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <span className="input-error">{formik.errors.confirmPassword}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone" className="input-label">
            Phone:{" "}
          </label>
          <input
            id="phone"
            className="input-tag"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <span className="input-error">{formik.errors.phone}</span>
          ) : (
            <span className="input-text">optional</span>
          )}
        </div>
        <div className="flex flex-row">
          <button type="submit" className="form-submit inline me-auto">
            Register
          </button>
          <label
            htmlFor="showPassword"
            className="inline input-label pt-[14px]"
          >
            Show Password:{" "}
          </label>
          <input
            onChange={handleChangeShowPassword}
            id="showPassword"
            type="checkbox"
            className="inline mt-2"
          />
        </div>
      </form>
    </>
  );
  function handleChangeShowPassword(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setShowPassword(event.target.checked);
  }
}
