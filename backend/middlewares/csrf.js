import csrf from "csurf";

const csrfMiddleware = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }
});

export default csrfMiddleware;
