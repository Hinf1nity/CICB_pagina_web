import ky from "ky";

const api = ky.create({

    prefixUrl:"http://localhost:4000/",
    headers: {"Content-Type" : "application/json",},
});

export default api;