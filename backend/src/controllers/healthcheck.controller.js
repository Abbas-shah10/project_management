import { ApiResponse } from '../utils/api-response.js';


const healthCheck = (req, res) => {
  try {
    res.status(200).json(
      new ApiResponse(200, { message: "Server is running!" })
    )
  } catch (error) {
    console.error('Server is not running', error)
  }
}

export { healthCheck };