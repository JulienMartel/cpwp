import contract_abi from './../../CpContractABI.json'
import Web3 from 'web3'
import sharp from "sharp"

const elementBGs = {
  grass: "#caf2b5",
  water: "#b8eeff",
  fire: "#fabf88",
  air: "#cdcdf5",
  egg: "#ffffff"
}


const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/cd2f36d854094edcbf3ee4016d19d874"))
const petsContract = new web3.eth.Contract(contract_abi, "0x86C10D10ECa1Fca9DAF87a279ABCcabe0063F247")

export default async function handler(req, res) {
  const { id, size } = req.query

  const resizeSize = size === "phone" ? 250 : 250
  const width = size === "phone" ? 828 : 1920
  const height = size === "phone" ? 1792 : 1080

  let uri
  try {
    uri = await petsContract.methods.tokenURI(id).call()
  } catch (e) {
    return res.status(500).json({error: `Pet ${id} has not been claimed yet`})
  }

  const result = await fetch(uri)
  const { image, attributes } = await result.json()

  const imgResult = await fetch(image)
  const imgBlog = await imgResult.blob()
  
  const imgArr = new Uint8Array(await imgBlog.arrayBuffer())
  
  const resizedImgArr = new Uint8Array(
    await sharp(imgArr)
      .resize(resizeSize, resizeSize)
      .toBuffer()
  )
    
  const element = attributes.filter(a => a.trait_type === 'Element')[0]?.value || "egg"

  try { // image creation + composition
    const wallpaperBuffer = await sharp({
      create: {
        width, 
        height, 
        channels: 3, 
        background: elementBGs[element],
      }
    })
      .composite([{ input: resizedImgArr }])
      .png()
      .toBuffer()

      res.status(200).json(wallpaperBuffer.toJSON())
  } catch (e) {
    throw e
  }
  
}
