import { FormEventHandler, useState } from 'react';
import { socket } from '../../socket';


export default function MyForm(){


    function payFn(){

    }

    return(
        <div onClick={payFn}>Pagar</div>
    )
}