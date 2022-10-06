import User from "App/Models/User"

class AuthService {
    public static async FindByUser(uid) {
        return await User
            .query()
            .where('email', uid)
            .orWhere('phone', uid)
    }
}
export default AuthService