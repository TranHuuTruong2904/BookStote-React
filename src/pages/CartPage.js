import React, {useEffect, useState} from "react";
import userLayout from "../user/userLayout"
import "./../assets/css/user-view.css";
import axiosApiInstance from "../context/interceptor";
import InputSpinner from 'react-bootstrap-input-spinner'
import {toast} from "react-toastify";
import axios from "../api/axios";
import {Link} from 'react-router-dom';

const CartPage = () => {
    const [myCart, setMyCart] = useState([]);
    const [status, setStatus] = useState(true);
    const [tmp, setTmp] = useState(0);
    const [checkedState, setCheckedState] = useState([]);
    const [total, setTotal] = useState(0);
    const [cart, setCart] = useState([]);

    async function getCart() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/cart/all`)
        setMyCart(result?.data?.data)
        setCheckedState(new Array(result?.data?.data.length).fill(false))
    }

    const getTotal = (itemChange) => {
        let t = 0
        cart.forEach(i => {
            t += i.amount * i?.productDetailModel?.productModel?.price
        })
        setTotal(t)
    }

    useEffect(() => {
        getCart()
    }, [tmp])
    useEffect(() => {
        getCart();
    }, []);
    
    useEffect(() => {
        getTotal()
    }, [cart])
    useEffect(() => {
    }, [myCart])

    // tích chọn sản phẩm để order
    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
        const addCheckout = updatedCheckedState.reduce(
            (sum, current, index) => {
                if (current === true) {
                    sum.push(myCart[index]);
                }
                return sum;
            }, []
        );
        setCart(addCheckout);
    };

    // thay đổi số lượng trong giỏ hàng
    const handleUpdateCart = async (item, amount) => {
        const body = {
            "productID": item?.productModel?.id,
            "amount": amount
        };

        const result = await axiosApiInstance.put(
            axiosApiInstance.defaults.baseURL + `/api/cart/update`, body
        );

        cart.forEach(i => {
            if (i.idCart === item?.idCart)
                i.amount = amount
        })
        getTotal(item?.idCart);
        setCart(cart)
    }

    // xóa sản phẩm khỏi giỏ hàng
    const handleDeleteItem = async (e) => {
        const result = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/cart/delete/${e.target.id}`)
        if (result?.data?.status === 200) {
            toast.success("Sản phẩm đc được xóa khỏi giỏ hàng của bạn!")
            setTmp(tmp + 1)
        } else
            toast.error("Lỗi! Vui lòng thử lại")
    }

    return (
        <>
            {status ?
            <div>
                <div className="container padding-bottom-3x marginTop marginBot">
                    <div className="table-responsive shopping-cart">
                        <h3 className="ms-5 mb-3 mt-1 text-danger">Giỏ hàng</h3>
                        <table className="table">
                            <thead>
                            <tr>
                                <th></th>
                                <th className="text-danger">Sản phẩm</th>
                                <th className="text-center text-danger">Đơn giá</th>
                                <th className="text-center text-danger">Số Lượng</th>
                                <th className="text-center text-danger">Tổng tiền</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {myCart.map((item, index) =>
                                <tr>
                                    <td><input type="checkbox" value={item.productDetailModel?.productModel?.name}
                                               onChange={() => handleOnChange(index)}
                                               checked={checkedState[index]}></input></td>
                                    <td>
                                        <div className="product-item">
                                            <a className="product-thumb" href="#"><img
                                                src={item.productDetailModel?.productModel?.linkImage} alt="Product"/></a>
                                            <div className="product-info">
                                                <h4 className="product-title"><a
                                                    href="#">{item.productDetailModel?.productModel?.name}</a></h4>
                                                <span><em>Size:</em> {item.productDetailModel?.size}</span>
                                                <span><em>Color:</em> {item.productDetailModel?.color}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center text-lg text-medium price_txt">{item.productDetailModel?.productModel?.price.toLocaleString('vi', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}</td>
                                    <td className="text-center ">
                                        <div className="count-input spinner_input">
                                            <InputSpinner
                                                type={'int'}
                                                precision={0}
                                                max={100}
                                                min={1}
                                                step={1}
                                                value={item?.amount}
                                                onChange={(e) => handleUpdateCart(item, e)}
                                                variant={'info'}
                                                size="sm"
                                            />
                                        </div>
                                    </td>
                                    <td className="text-center text-lg text-medium">{(item.productDetailModel?.productModel?.price * item?.amount).toLocaleString('vi', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}</td>
                                    <td className="text-center">
                                        <button className="remove-from-cart" 
                                                onClick={handleDeleteItem}
                                                data-toggle="tooltip" title=""
                                                data-original-title="Remove item"><i id={item.productDetailModel?.id} className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="shopping-cart-footer">
                        <div className="column text-danger"><strong>Tổng tiền: </strong><span
                            className="text-medium">{total.toLocaleString('vi', {
                            style: 'currency',
                            currency: 'VND'
                        })}</span></div>
                    </div>
                    <div className="shopping-cart-footer">
                        <div className="column"><a className="btn btn-outline-secondary" href="/shop"><i
                            className="icon-arrow-left"></i>&nbsp;Quay lại cửa hàng</a></div>
                        <div className="column">
                            <Link className="btn btn-success" to="/order" state={cart}>Đặt hàng</Link>
                        </div>

                    </div>
                </div>
            </div>
            :
            <div className="container padding-bottom-3x marginTop marginBot">
                <h3 className="ms-5 mb-3 mt-1">Giỏ hàng</h3>
                <p className="ms-3 mt-2">Không có sản phẩm trong giỏ hàng</p>
                <div className="column ms-3"><a className="btn btn-outline-secondary mt-5" href="/shop"><i
                    className="icon-arrow-left"></i>&nbsp;Quay lại cửa hàng</a></div>
            </div>
        }
        </>
    )
}
export default userLayout(CartPage)