import ky from "ky";

const api = ky.create({
    prefixUrl:"http://localhost:4000/",
});

export default api;