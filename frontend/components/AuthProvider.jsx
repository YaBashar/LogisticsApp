import { useState } from 'react'
import { AuthContext } from './AuthContext'

function AuthProvider({children}) {

    const [userId, setUserId] = useState("")
    const [accessToken, setAccessToken] = useState("")
    const [role, setRole] = useState("")

    const contextValue = {
        userId, 
        setUserId,
        accessToken,
        setAccessToken,
        role,
        setRole
    }

    return (
        <AuthContext.Provider value = {contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }