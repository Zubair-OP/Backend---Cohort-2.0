import { createContext , useState } from "react";

export const authContext = createContext()

export function AuthProvider({children}){

    const [User, setUser] = useState(null)
    const [loading, setloading] = useState(false)


    return (
    <authContext.Provider value={{User , loading , setUser , setloading}}>
        {children}
    </authContext.Provider>
)
}




export default AuthProvider

