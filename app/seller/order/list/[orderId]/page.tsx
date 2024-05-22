interface Props {
    params: {
        orderId: string;
    }
}

const OrderDetails = ({ params }: Props) => {
    console.log(params.orderId)
    return (
        <div>Order Details</div>
    )
}

export default OrderDetails