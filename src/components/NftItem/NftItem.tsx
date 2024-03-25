import { request } from 'graphql-request'
import {  AccountState, NftItem } from "../NftList/types"
import { CheckIsDisintarQuery, endpoint } from '../NftList/queries'
import { beginCell, fromNano, toNano } from '@ton/core'

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { CardActions, Divider, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { addressToFriendlyBounceable } from '../NftList/helpers';
import { apiSource } from '../NftList/constants'





const NftItemComponent = ({item, sendTx}: {
    item: NftItem,
      sendTx: (tx: any) => void}) => {
        const {nft_address_friendly, seller_address_friendly, price, seller_wc_raw, seller_address_raw} = item
        const [error, setError] = useState<string | undefined>(undefined)
        const [itemDetails, setItemDetails] = useState<any>(item)

        useEffect(() => {
            
            const fetchItemIpfs = async (route: any) => {
                await fetch(route)
                .then(response => response.json())
                .then(response => {
                    setItemDetails((prev: any) => ({
                        ...prev,
                        ...response
                    }))}
                    ).catch(error => {
                        console.log(error)
                        setError(error.message)
                    })
                }

                const fetchItemDetails = async () => {
                    await fetch(apiSource + 'getNFTInfo' + '?nft_address='+ nft_address_friendly)
                    .then(response => response.json())
                    .then(response => {
                        if(response?.data){
                            const name = response.data?.name;
                            const ipfs_address = response.data?.ipfs_address;

                            setItemDetails({
                            ...item,
                            name,
                            ipfs_address,
                         })
                        }
                        if(response?.error){
                            setItemDetails({...item,
                                error: response.error})
                        }
                        
                        if(response?.data?.ipfs_address?.startsWith('http')){
                            fetchItemIpfs(response?.data?.ipfs_address)
                        }
                    })
                }
           
            
                fetchItemDetails()
    },[item])

    

    const handleSelect = async (item: NftItem) => {
        const {raw_transactions}:{raw_transactions:[] } = await request(
            endpoint, CheckIsDisintarQuery(item.seller_wc_raw, item.seller_address_raw.toString()))
        if (!raw_transactions.length){
            setError('NFT not listed on disintar')
            return;
        }

        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
                {
                    address: item?.seller_address_friendly,
                    amount: toNano('1.1').toString(),
                    payload: beginCell().storeUint(3,32).storeUint(0,64).endCell().toBoc().toString("base64"),
                },
            ],
        }
        sendTx(tx)
        }

        const handleImageError = (e: any) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/180"
        }

    return (
            <Card variant="outlined">
                <CardHeader title={itemDetails?.data?.name || itemDetails?.error} />
                <CardMedia 
                    component="img"
                    sx={{ height: 360, objectFit:'initial', padding: 4}} 
                    image={itemDetails?.image || 'https://via.placeholder.com/360'}
                    title={itemDetails?.data?.name}
                    onError={handleImageError}
                />
                <CardContent>
                <Typography gutterBottom variant='body1' component="div">
                        NFT
                    </Typography>
                    <Typography gutterBottom variant='caption' component="div">
                        {item?.nft_address_friendly}
                    </Typography>
                    <Typography gutterBottom variant='body1' component="div">
                    Seller
                    </Typography>
                    <Typography gutterBottom variant='caption' component="div">
                       {item?.seller_address_friendly}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography gutterBottom variant="h5" component="div">
                        Price: {item?.price} TON
                    </Typography>
                    <Typography gutterBottom variant='caption' component="div">
                        {error}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small"
                     variant="contained"
                     onClick={()=> handleSelect(item)}
                     >
                         Снять с продажи
                    </Button>
                </CardActions>
             </Card>
    )
}

export {NftItemComponent}