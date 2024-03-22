
import { AccountState, Address } from '@ton/core'
import { gql } from 'graphql-request'

const endpoint = 'https://dton.io/graphql/'

const RawAccountStatesQuery = (wc: number, addr:string) =>gql`query
    {
        raw_account_states(
          parsed_seller_nft_prev_owner_address_workchain: ${wc}
          parsed_seller_nft_prev_owner_address_address: "${addr}"
          parsed_seller_is_closed: 0
          order_by: "parsed_seller_nft_price"
          order_desc: true
        ) {
          seller_wc: workchain
          seller_address: address
          nft_address: parsed_seller_nft_address_address
          nft_workchain: parsed_seller_nft_address_workchain
          parsed_seller_nft_price
        }
      }
`

const CheckIsDisintarQuery = (wc: number, adress: string) => gql`query {
    raw_transactions(
      workchain: ${wc}
      address: "${adress}"
        
      in_msg_src_addr_workchain_id: 0
      in_msg_src_addr_address_hex: "EB2EAF97EA32993470127208218748758A88374AD2BBD739FC75C9AB3A3F233D"
    ){
      gen_utime
    }
  }`

export {RawAccountStatesQuery, CheckIsDisintarQuery, endpoint}