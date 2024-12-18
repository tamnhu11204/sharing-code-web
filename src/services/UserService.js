import axios from "axios";

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/log-in`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        status: error.response.status,
        message: error.response.data.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const signupUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        status: error.response.status,
        message: error.response.data.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-details/${id}`)
  return res.data
};

export const refreshToken = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`, {
    withCredentials: true
  })
  return res.data
};

export const logoutUser = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`)
  return res.data
};
