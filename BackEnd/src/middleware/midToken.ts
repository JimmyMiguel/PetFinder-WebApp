import jwt, {JwtPayload} from 'jsonwebtoken'
 import { Response,Request,NextFunction } from 'express'
 


  //creamos la funcion y el nextFuncion para ejecutar lo siguiente despuesde de este funcion
export const requireAuth =   (req:Request,res:Response,next:NextFunction)=>{
    //traemos el encabezado de la peticion http 
    //que se llama autorizacion 
  const authHeader = req.get("Authorization")
  // 2. Comprobamos si no hay header o si no empieza con "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No se proporcionó un token válido"
    });
  }

  // Por estándar, el token viene como "Bearer <el_token_largo>".
  // Con split(" ") divides esa frase en un arreglo ["Bearer", "<el_token_largo>"] y tomas la posición [1]
  const token = authHeader.split(" ")[1]

  try {
    //verificamos el token parseado con el token que nosotros creamos 
    const check = jwt.verify(token, process.env.JWT_TOKEN!) as JwtPayload

// Si se verificó bien, guardas el contenido del token (usualmente el ID del usuario) en 'res.locals'
    // res.locals es un espacio seguro en Express para pasar datos entre middlewares y controladores
    res.locals.JwtPayload = check
  //una vez ejecute el middleware , ejecutara la otra funcion del endpoint
    next()
  } catch (error) {
    return res.status(401).json({ message: "Sesión expirada o token inválido" });

  }

}