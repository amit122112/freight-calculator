// Authentication utility functions

/**
 * Saves the authentication token to localStorage
 */
export function saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }
  
  /**
   * Retrieves the authentication token from localStorage
   */
  export function getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }
  
  /**
   * Removes the authentication token from localStorage
   */
  export function removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }
  
  /**
   * Saves user data to localStorage
   */
  export function saveUser(user: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }
  
  /**
   * Retrieves user data from localStorage
   */
  export function getUser(): any | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          return JSON.parse(userData)
        } catch (e) {
          console.error("Error parsing user data:", e)
          return null
        }
      }
    }
    return null
  }
  
  /**
   * Removes user data from localStorage
   */
  export function removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }
  
  /**
   * Checks if the user is authenticated
   */
  export function isAuthenticated(): boolean {
    return !!getToken()
  }
  
  /**
   * Logs out the user by removing token and user data
   */
  export function logout(): void {
    removeToken()
    removeUser()
    localStorage.removeItem("remember_me")
  }
  