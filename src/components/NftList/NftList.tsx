import React, { useEffect } from'react'
import { request } from 'graphql-request'
import { RawAccountStatesQuery, endpoint } from './queries'
import { AccountState } from './types'
import './styles.scss'
import { NftItemComponent } from '../NftItem'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { fromNano } from '@ton/core'


import { CircularProgress, Container, Grid, TextField, Alert  } from '@mui/material'
import { addressToFriendlyBounceable, walletAddressToRaw } from './helpers'
import { apiSource } from './constants'


const NftList = () => {
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();
    const [data, setData] = React.useState<AccountState[] | undefined>()
    const [itemsData, setItemsData] = React.useState<any [] | undefined>()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | undefined>()
    const [list, setList] = React.useState<any [] | undefined>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {account_wc, account_address} = walletAddressToRaw(wallet?.account);
                const {raw_account_states}: { raw_account_states: AccountState[]; }
                 = await request(endpoint, RawAccountStatesQuery(account_wc, account_address))
                if(raw_account_states){
                    setData(raw_account_states)
                }
            } catch (err: any) {
                setError(err.message)
            }
        }

        setLoading(true)
        if(wallet){
            fetchData()
        }

    }, [wallet])

    useEffect(() => {
        if (data) {
          const fetchItemDetails = async () => {
            const updatedItems: any [] = [];
            for (const item of data) {
                const seller_address_friendly = addressToFriendlyBounceable(item.seller_wc, item.seller_address)
                const nft_address_friendly = addressToFriendlyBounceable(item.nft_workchain, item.nft_address)
                const price = fromNano(item.parsed_seller_nft_price)
                let ipfs_address = null;
                await fetch(apiSource + 'getNFTInfo' + '?nft_address='+ nft_address_friendly)
                .then(response => response.json())
                .then(response => {
                    if(response.success){
                        const extendedData = response.data;
                        ipfs_address = extendedData.ipfs_address
                    }
                    return;
                }).catch((err)=> setError(err.message))
                if(ipfs_address){
                    await fetch(ipfs_address)
                    .then(response => response.json())
                    .then(response => 
                        updatedItems.push({
                            seller_address_friendly,
                            nft_address_friendly,
                            seller_wc_raw: item.seller_wc,
                            seller_address_raw: item.seller_address,
                            price,
                            ...response
                        })).catch(err => setError(err.message))
                } else {
                    setError('NFT not found on IPFS')
                    return;
                }
            }
            setItemsData(updatedItems);
            setList(updatedItems)
            setLoading(false)
          };
    
          fetchItemDetails();
          
        }
      }, [data]);

    const sendTx = (tx: any) => {
        tonConnectUi.sendTransaction(tx)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase()
        const filteredData = itemsData?.filter(item => item?.name.toLowerCase().includes(searchTerm))
        setList(filteredData)
    }

    if(!wallet) {
        return <Container maxWidth="lg">
                    <Alert severity="info">Connect Wallet</Alert>
                </Container>
    }

return <Container maxWidth="lg" sx={{pb: 8}}>
            <TextField id="outlined-basic" 
                className='state-list-search__input'
                placeholder="Search"
                onChange={handleSearch}
                label="Search"
                variant="filled"
                sx={{ mb: 4 }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !list?.length && <Alert severity="info">No NFTs found</Alert>}
            <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 2, sm: 4, md: 8 }}>
                {loading ? <CircularProgress sx={{margin:'auto', mt: 8}}/> : 
                    list?.map((item, index) => 
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <NftItemComponent setError={setError} sendTx={sendTx} item={item}/>
                    </Grid>
                )}
            </Grid>
        </Container>
}

export {NftList}