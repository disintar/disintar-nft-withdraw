import { Address } from "@ton/core"

type AccountState = {
    seller_wc: number,
    seller_address: string,
    nft_address: string,
    nft_workchain: number,
    parsed_seller_nft_price: string

    
}

type NftItem = {
    nft_address_friendly: string
    price: string
    seller_address_friendly: string
    seller_address_raw: string
    seller_wc_raw: number
}


type NftItem1 = {
    seller_wc: number,
    seller_address: string,
    nft_address: string,
    nft_workchain: number,
    parsed_seller_nft_price: string

    attributes: object
    description: string
    image: string
    name:string
    nft_address_friendly: string
    price: string
    seller_address_friendly: string
    seller_wc_raw: number
    seller_address_raw: string
    error: string | undefined

}

export type {AccountState, NftItem}