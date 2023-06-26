import React from "react";
import { useState, useEffect } from "react";
import userLayout from "../user/userLayout";
import axios from "../api/axios";
import "./../assets/css/order.css";
import axiosApiInstance from "../context/interceptor";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading'

const ProfileUserPage = () => {

    const [load, setLoad] = useState(false);
    const [status, setStatus] = useState(1);
    const [profile, setProfile] = useState({});
    const [customerPoint, setCustomerPoint] = useState({})
    const [levelCustomer, setLevelCustomer] = useState("")
    const [order, setOrder] = useState([])
    const [infoChange, setChange] = useState({});
    const listST = ["Chờ xác nhận", "Đang giao hàng", "Đã nhận hàng", "Đơn đã hủy"];
    const [tmp, setTmp] = useState(listST.at(0));

    let total

    async function getProfile(){
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/profile`);
        if(result?.data?.status === 200)
        {
            setLoad(true);
            setProfile(result?.data?.data);
        }
    }

    async function getCustomerPoint()
    {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/customer-point`)
        if(result?.data?.status == 200)
        {
            setLoad(true);
            setCustomerPoint(result?.data?.data);
        }
    }

    async function getLevelCustomer()
    {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/customer-point/level`)
        if(result?.data?.status === 200)
        {
            setLoad(true);
            setLevelCustomer(result?.data?.message)
        }
    }

    const updateProfile = async () => {
        if(Object.keys(infoChange).length !== 0)        
        {
            const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/user/profile`, infoChange);
            if(result?.data?.status === 200)
            {
                toast.success("Hồ sơ đã được cập nhật!")
            }
            else
            {
                toast.error("Cập nhật thất bại!")
            }
        }
    }

    const handleChangProfile = (e) => {
        const id = e.target.id
        infoChange[id] = e.currentTarget.value
    }

    async function getOrder(){
        setLoad(false)
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/order/status=${tmp}`);
        if(result?.data?.status === 200)
        {
            setLoad(true)
            setOrder(result?.data?.data)
        }
    }  

    async function handleCancel(e){
        const confirm = window.confirm("Xác nhận hủy đơn? ");
        if(confirm)
        {
            const result = await axiosApiInstance.delete( axiosApiInstance.defaults.baseURL + `/api/order/cancel_order?order_id=${e.currentTarget.id}`);
            if(result?.data?.status === 200)
            {
                toast.success(result?.data?.message);
            }
            else{
                toast.error(result?.dtaa?.message);
            }
        }
        await getOrder();
    }

    async function handleReceiptedOrder(e){
        const confirm = window.confirm("Bạn đã nhận được đơn hàng? ");
        if(confirm)
        {
            const result = await axiosApiInstance.post( axiosApiInstance.defaults.baseURL + `/api/order/invoice/${e.currentTarget.id}`);
            if(result?.data?.status === 200)
            {
                toast.success("Cảm ơn bạn đã xác nhận. Vui lòng kiểm tra hóa đơn trong email của bạn!");
            }
            else{
                toast.error("Xác nhận thất bại. Vui lòng thử lại!");
            }
        }
        await getOrder();
    }

    useEffect(() => {
        getProfile();
        getOrder();
    }, [tmp])

    useEffect(() => {
        getCustomerPoint();
        getLevelCustomer();
    }, [])
    const clickInfor = (e) => {
        setStatus(1);
        setChange({})
    }
    
    const clickTheOrder = (e) => {
        setStatus(2);
        setChange({})
    }

    const clickStatus = (e) => {
        setTmp(e.target.id)
    }

    return (
        <>
            <div class="margin-left-right padding-bottom-3x marginTop marginBot row">
                <div class="table-responsive block-infor-left ms-2">
                    <button className={status == 1 ? " buttonHead active w-100" : "buttonHead w-100"}
                        onClick={clickInfor}>Hồ sơ của tôi
                    </button>
                    <button className={status == 2 ? "buttonHead mb-3 active w-100" : " buttonHead mb-3 w-100"}
                        onClick={clickTheOrder}>Đơn đặt hàng
                    </button>
                </div>

                <div class="table-responsive block-infor-right" >
                    {status == 1 ? 
                        load ?
                        <div>
                            <h4 className="ms-4 mb-3 mt-3 text-danger text-center">Hồ sơ của tôi </h4>
                            <div style={{display:"flex", margin:"10px", justifyContent:"space-between"}}>
                                <h6 className="text-danger"><i class="fa fa-duotone fa-credit-card"></i> Cấp độ thẻ tích điểm: {levelCustomer}</h6>
                                <h6 className="text-danger"> Số điểm tích lũy: {customerPoint.points}</h6>
                            </div>
                            <div className="row mb-3 ms-3 me-3 borderr ">
                                    <div className="field field_v1 col">
                                    <label htmlFor="first-name" className="ha-screen-reader">Họ & đệm</label>
                                    <input id="firstname" className="field__input text-danger" onChange={handleChangProfile}
                                        defaultValue={(profile.firstname ? profile.firstname : "")} placeholder=" "></input>
                                    <span className="field__label-wrap" aria-hidden="true">
                                        <span className="field__label text-success">Họ & đệm</span>
                                    </span>
                                </div>
                                <div className="field field_v1 col">
                                    <label htmlFor="lastname" className="ha-screen-reader">Tên</label>
                                    <input id="lastname" className="field__input text-danger" onChange={handleChangProfile}
                                        defaultValue={(profile.lastname ? profile.lastname : "")}
                                        placeholder=" "></input>
                                    <span className="field__label-wrap" aria-hidden="true">
                                        <span className="field__label text-success">Tên</span>
                                    </span>
                                </div>
                                <div className="row mb-2">
                                    <div className="field field_v1 col">
                                        <label htmlFor="phone" className="ha-screen-reader">Số điện thoại</label>
                                        <input id="phone" className="field__input text-danger" required="required" onChange={handleChangProfile}
                                            defaultValue={profile?.phone} placeholder=" "></input>
                                        <span className="field__label-wrap" aria-hidden="true">
                                            <span className="field__label text-success">Số điện thoại</span>
                                        </span>
                                    </div>
                                    <div className="field field_v1 col ">
                                        <label htmlFor="email" className="ha-screen-reader">Email</label>
                                        <input id="email" className="field__input text-danger"
                                            value={profile?.accountModel?.email} placeholder=" " disabled></input>
                                        <span className="field__label-wrap" aria-hidden="true">
                                            <span className="field__label text-success">Email</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="field field_v1 mb-2">
                                    <label htmlFor="address" className="ha-screen-reader">Địa chỉ</label>
                                    <input id="address" className="field__input text-danger" onChange={handleChangProfile}
                                        defaultValue={profile?.address}
                                        placeholder=" "></input>
                                    <span className="field__label-wrap" aria-hidden="true">
                                        <span className="field__label text-success">Địa chỉ</span>
                                    </span>
                                </div> 
                                <div className="col-10 mt-3 mb-3 m-auto text-center" onClick={updateProfile}>
                                    <button className="btn btn-danger center w-60"> Cập nhật thông tin </button>
                                </div>
                                <Link className="changePass text-danger" to="/change-pass"> Đổi mật khẩu</Link>
                            </div>
                        </div>
                        :
                        <div>Loading......</div>
                        :
                        <div>
                            <div className="status-order">
                            {
                                listST.map(i =>
                                    <button id={i}
                                        className={tmp === i ? " buttonStatus active " : " buttonStatus "}
                                        onClick={clickStatus}
                                        >{i}
                                    </button>
                                )
                            }
                        </div>
                        {load ?
                            (order.length ?
                                order.map(item =>
                                    <table className="table status-table">
                                        <tr>
                                            <td className="h6 text-danger text-center">Mã đơn hàng:{item?.id}</td>
                                            <td className="h6 text-danger text-center">Ngày đặt: {item?.date}</td>
                                        </tr>
                                        {item?.orderDetailModels?.map(k =>
                                            <tr>
                                                <td>
                                                    <div className=" display-flex">
                                                        <a className="" href="#"><img className="imageInfor"
                                                            src={k.productDetailModel?.productModel?.linkImage}
                                                            style={{width:"100px", height:"150px"}}
                                                            alt="Product" /></a>
                                                        <div className="ms-1 mt-1">
                                                            <p><a className="h4"
                                                                href="#">Tên: {k.productDetailModel?.productModel?.name}</a></p>
                                                                <p><a className="h4"
                                                                href="#">{k.productDetailModel?.productModel?.description}</a></p>
                                                            <p className=" fontSizeInfor ">Size: {k.productDetailModel?.size}</p>
                                                            <p className=" fontSizeInfor ">Color: {k.productDetailModel?.color}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center ">x{k.amount}</td>
                                                <td className="h6 text-center ">{(k.productDetailModel.productModel.price).toLocaleString('vi', {style: 'currency',currency: 'VND'})}</td>
                                                <td className="h6 text-center ">={(k.productDetailModel.productModel.price * k.amount).toLocaleString('vi', {style: 'currency',currency: 'VND'})}</td>
                                            </tr>
                                        )
                                        }
                                        <tr>
                                            <td>
                                                <div>
                                                    <h6 className="h6">{item?.receiveModel?.name}</h6>
                                                    <h6 className="h6">Địa chỉ: {item?.address}</h6>
                                                 </div>
                                                 </td>
                                            <td></td>
                                            <td className="text-center ">Phí ship:</td>
                                            <td className="text-center">{(item?.feeShip).toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</td>
                
                                        </tr>
                                        <tr>
                                            <td></td>

                                            <td></td>
                                            <td className="text-center">Tổng tiền:</td>
                                            <div style={{ display: "none" }}>
                                                {total = 0}
                                                {item?.orderDetailModels?.map(item => {

                                                    total += item.amount * item.productDetailModel.productModel.price;
                                                })
                                                }</div>
                                            <td className="text-center">
                                                {(total + item?.feeShip).toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                            </td>

                                        </tr>
                                        {tmp === listST[0] ?
                                            <button className="buttonHead" id={item?.id} 
                                            onClick={handleCancel}
                                            >Hủy Đơn</button> : null}

                                        {tmp === listST[1] ?
                                            <button className="buttonHead" id={item?.id}
                                            onClick={handleReceiptedOrder}>
                                            Đã nhận được hàng
                                            </button> : null}

                                            {tmp === listST[2] ?
                                            <button className="buttonHead" id={item?.id}>
                                            Đánh giá sản phẩm
                                            </button> : null}
                                    </table>
                                )
                                :
                                <div>
                                    <h6 className="center">Bạn không có đơn đặt hàng trong trạng thái này</h6>
                                    <div class="shopping-cart-footer">
                                        <div class="buttonBackHome">
                                            <Link class="btn btn-danger" to="/shop"> Tiếp tục mua sắm </Link></div>
                                    </div>
                                </div>)
                            :
                            <div className={"center loading"}>
                                <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                            </div>
                        }
                        </div>
                    }
                </div>
            </div>


        </>
    )
}

export default userLayout(ProfileUserPage)