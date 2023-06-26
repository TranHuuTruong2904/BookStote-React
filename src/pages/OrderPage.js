import React from "react";
import { useState, useEffect } from "react";
import userLayout from "../user/userLayout";
import "./../assets/css/order.css";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state;
    const [profile, setProfile] = useState({});
    const [order, setOrder] = useState({});
    const [receive, setReceive] = useState([]);
    const [selectedReceive, setSelectedReceive] = useState('');
    const [load, setLoad] = useState(true);
    const [loadConfirmOrder, setLoadConfirmOrder] = useState(false)
    const [feeShip, setFeeShip] = useState(0);
    const [tmpMoney, setMoney] = useState(0);
    const [nameReceiver, setName] = useState();
    const [phoneReceiver, setPhone] = useState();
    const [address, setAddressShow] = useState();
    const [addressConfirm, setAddressConfirm] = useState();
    const [payment, setPayment] = useState(1);

    const checkPayCOD = (e) => {
        setPayment(2)
    }

    const checkPayVNPay = (e) => {
        setPayment(1)
    }

    const paymetVNPAY = async (id) => {
        toast.info("Đang chuyển hướng đến VNPay")
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/payment/create_payment/${id}`);
        window.location.href = result?.data?.url
    }

    useEffect(() => {
        let t = 0
        cart.forEach((i) => {
            t += i?.amount * i?.productDetailModel?.productModel?.price
        })
        setMoney(t)
    }, [])


    async function getProfile(){
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/profile`);
        setLoad(true);
        const data = result?.data?.data
        setProfile(data);

        setName((data?.firstname ? data.firstname : '') + ' ' + (data?.lastname ? data.lastname : ''))
        setPhone(data?.phone)
        
        order.address = data.address
        if(!data.address)
        {
            handleInfor()
        }
        else{
            setAddressShow(data?.address)
        }
        setOrder(order)
    }

    async function getReceive() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/receive/all`);
        setLoad(true);
        setReceive(result?.data?.data);
    }

    const handleInfor = () => {
        setAddressShow(order?.address)
        setLoad(false)
    }

    const changeName = (e) => {
        setName(e.target.value)
    }

    const changePhone = (e) => {
        setPhone(e.target.value)
    }

    const changeAddress = (e) => {
        setAddressShow(e.target.value)
    }

    function handleReceiveChange(event) {
        const selectedValue = event.target.value;
        setSelectedReceive(selectedValue);
    }

    useEffect(() => {
        if(receive.length > 0)
        {
            setSelectedReceive(receive[0].id);
        }
    }, [receive]);

    useEffect(() => {
        if(selectedReceive === '3')
        {
            setFeeShip(0);
        }
        else if(selectedReceive === '2')
        {
            setFeeShip(45000)
        }
        else{
            setFeeShip(30000);
        }
    }, [selectedReceive]);

    useEffect(() => {
        if(selectedReceive === '3')
        {
            setAddressConfirm("97 Man Thiện, Quận 9, Thành phố Hồ Chí Minh")
        }
        else
        {
            setAddressConfirm(address)
        }
    }, [setAddressConfirm, address, selectedReceive]);

    const handleConfirmOrder = async () => {
        setLoadConfirmOrder(true);
        const productOrder = []
        cart.forEach((i) => {
            productOrder.push({"product_id": i?.productDetailModel?.id, "amount": i.amount })
        })

        const payload = {
            "note" : "none",
            "feeShip" : feeShip,
            "phone" : phoneReceiver,
            "address" : addressConfirm,
            "listProduct" : productOrder
        }

        if(payload.address && payload.phone)
        {
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/order/create/${selectedReceive}`, payload);
            if(result?.data?.status === 200)
            {
                toast.success("Đơn hàng đã được tạo. Vui lòng kiểm tra email để xác nhận đơn hàng!")
                console.log(result)
                if (payment === 1) {
                    paymetVNPAY(result?.data?.data?.id);
                } else {
                    navigate('/profile');
                }
            }
            else {
                toast.error("Vui lòng kiểm tra thông tin! " + result?.data?.message)
            }
        }
        else
        {
            toast.error("Vui lòng điền đầy đủ thông tin!");
        }
        setLoadConfirmOrder(false);
    };

    useEffect(() => {
        getProfile();
        getReceive();
    }, [])
    
    return (
        <>
        {
        location ?
            <div className="margin-left-right padding-bottom-3x marginTop marginBot row">
                <div className="table-responsive block-left  ms-2 ">
                    <h5 className="ms-4 mb-3 mt-3 text-danger">Thông tin khách hàng</h5>
                    {load ?
                        <div>
                            <div className="form-wrapper">
                                <div className="borderForm">
                                    <div className="field field_v1 ms-4">
                                        <label for="first-name" className="ha-screen-reader">Họ tên</label>
                                        <input id="nameReceiver"
                                            defaultValue={nameReceiver}
                                            onChange={changeName} className="field__input text-danger" placeholder=" " disabled></input>
                                        <span className="field__label-wrap" aria-hidden="true">
                                            <span className="field__label">Họ tên</span>
                                        </span>
                                    </div>
                                    <div className="field field_v1 ms-4">
                                        <label for="first-name" className="ha-screen-reader">Số điện thoại</label>
                                        <input id="phoneReceiver" defaultValue={phoneReceiver} disabled className="field__input text-danger" onChange={changePhone}
                                            placeholder=" "></input>
                                        <span className="field__label-wrap" aria-hidden="true">
                                            <span className="field__label">Số điện thoại</span>
                                        </span>
                                    </div>
                                    <div className="field field_v1 ms-4 mb-2">
                                        <label htmlFor="first-name" className="ha-screen-reader">Địa chỉ</label>
                                        <input id="address" className="field__input text-danger" disabled defaultValue={address} onChange={changeAddress}
                                            placeholder=" "></input>
                                        <span className="field__label-wrap" aria-hidden="true">
                                            <span className="field__label">Địa chỉ</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="parent">
                                <a className="h6 changePass text-center text-danger" href="/profile">Thay đổi thông tin nhận hàng</a>
                            </div>
                        </div>
                        :
                        <form onSubmit={handleConfirmOrder}>
                            <div className="field field_v1 ms-4">
                                <label for="first-name" className="ha-screen-reader">Họ tên</label>
                                <input id="nameReceiver"
                                    defaultValue={nameReceiver}
                                    onChange={changeName} required className="field__input" placeholder=" " ></input>
                                <span className="field__label-wrap" aria-hidden="true">
                                    <span className="field__label">Họ tên</span>
                                </span>
                            </div>
                            <div className="field field_v1 ms-4">
                                <label for="first-name" className="ha-screen-reader">Số điện thoại</label>
                                <input id="phoneReceiver" required defaultValue={phoneReceiver} className="field__input" onChange={changePhone}
                                    placeholder=" "></input>
                                <span className="field__label-wrap" aria-hidden="true">
                                    <span className="field__label">Số điện thoại</span>
                                </span>
                            </div>

                            <div className="row mb-3">
                            
                            </div>
                            <div className="field field_v1 ms-4 mb-2">
                                <label htmlFor="first-name" required className="ha-screen-reader">Địa chỉ</label>
                                <input id="address" className="field__input" defaultValue={address} onChange={changeAddress}
                                    placeholder=" "></input>
                                <span className="field__label-wrap" aria-hidden="true">
                                    <span className="field__label">Địa chỉ</span>
                                </span>
                            </div>
                        </form>
                    }

                    <h5 className="ms-4 mb-3 mt-2 text-danger">Chọn phương thức nhận hàng</h5>
                    <div className="radio-wrapper">
                        <label className="radio-lable borderForm">
                            <select style={{width:"100%", height:"30px"}} id="receive" value={selectedReceive} onChange={handleReceiveChange}>
                                {receive.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <h5 className="ms-4 mb-2 mt-3 text-danger">Phương thức thanh toán</h5>
                    {/* <div className="field field_v1 ms-4 mb-5 borderForm">
                        <div tabindex="0" className="me-2 mt-2 mb-2 ms-4">
                            <button class="btn select-pay" label="TM"><img className="method-icon" width="32" src="https://juli.vn/upload/images/bai-viet/hinh-thuc-thanh-toan.jpg" alt="TM" />Thanh toán khi nhận hàng(COD)</button>
                        </div>

                    </div> */}
                    <div className=" field field_v1 ms-4 mb-5 borderForm">
                        <div tabindex="0" className="me-2 mt-2 ms-4">
                            <button className={payment == 1 ? "btn select-pay" : "btn pay"} label="VNpay" onClick={checkPayVNPay}>
                                <img className="method-icon" width="32" src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" />
                                Thanh toán qua VNPay</button>
                        </div>
                        <div tabindex="0" className="me-2 mt-2 mb-2 ms-4">
                            <button className={payment == 2 ? "btn select-pay" : "btn pay"} label="TM" onClick={checkPayCOD}><img className="method-icon" width="32" src="https://juli.vn/upload/images/bai-viet/hinh-thuc-thanh-toan.jpg" alt="TM" />Thanh toán khi nhận hàng(COD)</button>
                        </div>
                    </div>
                    <div className="shopping-cart-footer">
                        <div><a className="btn btn-outline-secondary mt-2 w-25 mb-2" href="/cart"><i
                            className="icon-arrow-left"></i>&nbsp;Giỏ hàng</a></div>
                    </div>
                </div>
                <div className="table-responsive block-right ">
                    <h5 className="ms-4 mb-3 mt-3 text-danger">Đơn hàng</h5>
                    <table className="table">
                        <tbody>
                            {cart.map((item, index) =>
                                <tr>
                                    <td>
                                        <div className=" display-flex">
                                            <a className="" href="#"><img className="image"
                                                src={item?.productDetailModel?.productModel?.linkImage}
                                                alt="Product" /></a>
                                            <div className="ms-2">
                                                <p><b className=" fontSize">Tên: {item?.productDetailModel?.productModel?.name}</b></p>
                                                <p className=" fontSize ">Mô tả: {item?.productDetailModel?.productModel?.description}</p>
                                                <p className=" fontSize ">Size: {item?.productDetailModel?.size}</p>
                                                <p className=" fontSize ">Color: {item?.productDetailModel?.color}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">x{item?.amount}</td>
                                    <td className="text-right">{item?.productDetailModel?.productModel?.price.toLocaleString('vi', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Tạm tính </td>
                                <td className="textAlign"><span>{tmpMoney.toLocaleString('vi', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</span></td>
                            </tr>
                            <tr>
                                <td>Phí ship </td>
                                <td className="textAlign"><span>{feeShip.toLocaleString('vi', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</span></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Tổng tiền </td>
                                <td className="textAlign"><span>{(tmpMoney + feeShip).toLocaleString('vi', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</span></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="shopping-cart-footer">
                        <div className="col-10 mt-3 mb-3 m-auto">
                            <button className="btn btn-danger w-100" type="submit" onClick={handleConfirmOrder}> {loadConfirmOrder ? ' Loading...' : 'Đặt hàng'} </button>
                        </div>
                    </div>
                </div>
            </div>
            :
            navigate("/cart")
    }
        </>
    )
};

export default userLayout(OrderPage);