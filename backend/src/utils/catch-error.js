import { connection } from "../database/connection.js";

const handleErrors = (res, error) => {
    return res.status(500).json({ message: 'Internal server error' });
};


export {handleErrors}

