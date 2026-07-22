import * as yup from "yup";

export const checkoutFormSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập họ và tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  street: yup.string().required('Vui lòng nhập địa chỉ'),
  note: yup.string(),
});
