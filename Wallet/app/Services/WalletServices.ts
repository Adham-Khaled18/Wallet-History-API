import Wallet from "App/Models/Wallet"

class WalletService{
    public static async view(owner_id,id?){
        if (id) {
            const wallet = await Wallet
            .query()
            .where('owner_id', owner_id)
            .andWhere('id',id)
        return wallet
        }
        const wallet = await Wallet
            .query()
            .where('owner_id', owner_id)  
        return wallet
    }

}
export default WalletService