
class CustomError extends Error{
    constructor(message, success) {
        super(message);
        this.message = message;
        this.success = success;
      }
    
      static success(message = 'Success message') {
        return new CustomError(message, 200);
      }
    
      static notFound(message = 'Resource not found') {
        return new CustomError(message, 404);
      }
    
      static unauthorized(message = 'Unauthorized') {
        return new CustomError(message, 401);
      }
    
      static badRequest(message = 'Bad request') {  // token expired vb
        return new CustomError(message, 400);
      }
    
      static serverError(message = 'Internal server error') {  // catch'lerde kullanmak icin
        return new CustomError(message, 500);
      }
    
      static unprocessableEntity(message = 'Unprocessable entity') {  //  failed the operation process
        return new CustomError(message, 422);
      }


}


module.exports = CustomError;