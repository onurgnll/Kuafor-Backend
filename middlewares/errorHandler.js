module.exports = (error, req, res, next) => {       
    res.status(200);
    res.json(
        {
            success: error.success || -500,
            data: [],
            message: error.message || "Sunucu Hatası"
        }
    );
}