import ky from "ky";

const api = ky.create({

    prefixUrl:"https://",
    headers: {"Content-Type" : "application/json",},
});

export default api;