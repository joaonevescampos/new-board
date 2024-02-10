const validationParamsRequest = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.params);

        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export { validationParamsRequest };