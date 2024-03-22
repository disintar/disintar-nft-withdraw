import React, { useEffect } from 'react'
import './NftItem.scss'
import { request } from 'graphql-request'
import { AccountState, NftItem } from "../NftList/types"
import { CheckIsDisintarQuery, endpoint } from '../NftList/queries'
import { beginCell, toNano } from '@ton/core'

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { CardActions, Typography } from '@mui/material'


const NftItemComponent = ({item, setError, sendTx}: {
    item: NftItem,setError:
     (error:string) => void,
      sendTx: (tx: any) => void}) => {

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
                    address: 'EQBUZC7yqxtyBfm9EngOQj5vYxwO3hjfeEY_QUGQp7qSSYXc',
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
                <CardHeader title={item?.name} />
                <CardMedia 
                    component="img"
                    sx={{ height: 360, objectFit:'contain'}}   
                    image={item?.image}
                    title={item?.name}
                    onError={handleImageError}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Price: {item?.price} TON
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