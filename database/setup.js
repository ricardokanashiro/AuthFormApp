import mongoose from "mongoose"

const ClusterPassword = process.env.CLUSTER_PASSWORD

mongoose.connect(`mongodb+srv://ricardokanashiroadm:${ClusterPassword}@authappcluster.nadvd.mongodb.net/?retryWrites=true&w=majority&appName=AuthAppCluster`)
.then(() => console.log("Conectado ao MongoDB!"))
.catch(err => console.log("Erro ao conectar ao MongoDB: " + err))

export default mongoose