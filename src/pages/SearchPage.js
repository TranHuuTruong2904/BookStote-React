import React, { useEffect, useState } from "react";
import userLayout from "../user/userLayout"
import "./../assets/css/user-view.css";
import axiosApiInstance from "../context/interceptor";
import { Form, Modal } from "react-bootstrap"
import InputSpinner from "react-bootstrap-input-spinner";
import "bootstrap/dist/css/bootstrap.css";
import axios from "../api/axios";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const SearchPage = () => {

    const  navigate = useNavigate()
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const decodedQuery  = decodeURIComponent(query.get("p"));
    const [list, setList] = useState([]);
    const [load, setLoad] = useState(false);
    const [loadSize, setLoadSize] = useState(false);
    const [status, setStatus] = useState(0);
    const [listCate, setListCate] = useState([]);
    const [productDetail, setProductSelected] = useState([]);
    const [imgSelect, setImgSelect] = useState();
    const [colorAvail, setColorAvail] = useState(new Set());
    const [sizeAvail, setSizeAvail] = useState();
    const [item, setItem] = useState({});
    const [show, setShow] = useState(false);
    const [order, setOrder] = useState([])


    const handleAddCart = async(id, amount) =>  {
        const body = {
            "idProduct" : id,
            "amount" : amount
        }
        const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/cart/addToCart`, body);
        return result;
    }

    async function getProduct() {
        const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/search?name=${decodedQuery}`);
        setLoad(true);
        setList(result?.data?.data)
    }
    
    async function getCategory() {
        const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/category/all`)
        setLoad(true);
        setListCate(result?.data?.data)
    }

    async function getDetails(id)
    {
        const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/detail/${id}`);
        setStatus(1)
        setLoadSize(false)
        setProductSelected(result?.data?.data)
        setSizeAvail(result?.data?.data)
        const setColor = new Set()
        result?.data?.data.forEach((i) => {
            setColor.add(i?.color)
        })
        setColorAvail(setColor);
    }

    const handleShow = (e) => {
        setImgSelect(e.target.title)
        setShow(true)
        getDetails(e.target.id)
    }


    const handleClose = () => {
        setShow(false);
        setImgSelect(null);
        setStatus(0)
        setItem({})
    }

    const handleChangeColor = (e) => {
        item.color = e.target.id
        setItem(item)
        setSizeAvail(productDetail.filter(i => i.color === e.target.id))
        setLoadSize(true)
    }

    const handleChangeSize = (e) => {
        item.size = e.target.id
        setItem(item)
    }

    const handleChangeAmount = (e) => {
        item.sl = e
        setItem(item)
    }

    const buyNow = (e) => {
        const tmp = {};
        if (item.color && item.size) {
            const newItem = productDetail.find(i => i?.color === item.color && i?.size == item.size)
            if (newItem) {
                if (newItem?.current_number < item?.sl || newItem?.current_number < 1)
                    toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
                else {
                    tmp.amount = item.sl ? item.sl : 1
                    tmp.productDetailModel = productDetail.find(i => i.color === item.color && i.size === item.size)
                    order.push(tmp)
                    setOrder(order)
                    navigate('/order', { state: order });
                }
             }
            } else
                toast.error("Vui lòng chọn đủ thông tin")
                    e.preventDefault()
    }

    const handleSubmitAdd = async (e) => {
        e.preventDefault()
        const newItem = productDetail.find(i => i?.color === item.color && i?.size == item.size)
        if (newItem) {
            if (newItem?.current_number < item?.sl || newItem?.current_number < 1)
                toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
            else {
                let kq = null;
                try {
                    kq = await handleAddCart(newItem?.id, item.sl ? item?.sl : 1)
                } catch (e) {

                }
                if (kq?.data?.status === 200) {
                    setItem({})
                    setShow(false)
                    toast.success("Sản phẩm đã được thêm vào giỏ hàng của bạn!", { position: "top-center" })
                } else {
                    toast.error("Thất bại! Vui lòng thử lại")
                }
            }

        }    else {
            toast.error("Vui lòng chọn màu và kích thước phù hợp!")
        }
    }

    useEffect(() => {
        getProduct();
        getCategory();
    }, [])


    return (
        <>

        {/* Start Product show */}
        <section>
            <div class="container py-5">
                <div class="row text-center py-3">
                    <div class="col-lg-6 m-auto">
                    <h2 class="h2 py-1 text-danger"><i class="fa fa-search"></i>Tìm kiếm</h2>
                    </div>
                </div>

                <div className="row">
                    {list.length !== 0 ? 
                        (list.map((item) => (
                            <div className="col-md-3">
                                <div className="card mb-3 product-wap rounded-0">
                                    <div className="card rounded-0">
                                        <img className="img-config card-img rounded-0 img-fluid"
                                            src={item.linkImage} />
                                        <div
                                            className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                            <button type="button" className="btn btn-danger text-white"
                                                title={item.linkImage} id={item?.id} onClick={handleShow}>
                                                XEM NGAY!
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="">
                                            <a href={`/product/${item?.id}`} className="h6 text-decoration-none text-config text-center" title={item.name}>{item.name}</a>
                                        </div>
                                        <h6 className="h6 text-decoration-none text-config">{item.description}</h6>
                                        <h6 className="h6 text-decoration-none text-config">Tác giả: {item.author}</h6>
                                        <p className="text-center mb-0 price_txt">{item.price.toLocaleString('vi', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}</p>
                                        <p className="text-center">Đã bán: {item.sold}</p>
                                    </div>
                                </div>
                            </div>
                        )))
                        :
                        <div className="col-lg-6 m-auto">
                            <p style={{color:"red"}}>Sản phẩm bạn vừa tìm không có trong cửa hàng!</p>
                        </div>
                    }
                </div>
            </div>

        </section>


        {/*<!--Start modal -->*/}
        <Modal show={show} onHide={handleClose} size={status ? "lg" : "sm"} centered>
            {status ?
                <Modal.Body>
                    <div class="container pb-5">
                        <div class="row">
                            <div class="col-lg-5 mt-5">
                                <div class="card mb-3">
                                    <img class="card-img img-fluid"
                                        src={imgSelect} alt="Card image cap"
                                        id="product-detail" />
                                </div>
                            </div>
                            {/* <!-- col end --> */}
                            {productDetail.length !== 0 ?
                                <div class="col-lg-7 mt-5">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3 class="h3">{productDetail.at(0)?.productModel?.name}</h3>
                                            <h3 class="h3">Tác giả: {productDetail.at(0)?.productModel?.author}</h3>
                                            <p class="h4 py-2 price_txt">{productDetail.at(0)?.productModel?.price.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</p>
                                            {<Form>
                                                <input type="hidden" name="product-title" value="Activewear" />
                                                <div class="row">
                                                    <div className="col-full">
                                                        <strong>Loại: </strong>
                                                        {<Form onChange={handleChangeColor}>
                                                            {Array.from(colorAvail).map((i) =>
                                                                <Form.Check
                                                                    inline
                                                                    reverse
                                                                    label={i}
                                                                    name="group1"
                                                                    type="radio"
                                                                    id={i}
                                                                />
                                                            )}
                                                        </Form>}
                                                    </div>

                                                    <div class="col-full">
                                                        <strong>Kích thước:</strong>
                                                        {loadSize ? <Form onChange={handleChangeSize}>
                                                            {sizeAvail?.map((i) =>
                                                                <Form.Check
                                                                    inline
                                                                    reverse
                                                                    label={i?.size}
                                                                    name="group_size"
                                                                    type="radio"
                                                                    id={i?.size}
                                                                />
                                                            )}
                                                        </Form> : null}
                                                    </div>

                                                    <div class="col-full flex align-items-center pb-3">
                                                        <strong className="me-3">Số lượng</strong>
                                                        <div className="count-input spinner_input">
                                                            <InputSpinner
                                                                type={'int'}
                                                                precision={0}
                                                                max={100}
                                                                min={1}
                                                                step={1}
                                                                value={1}
                                                                onChange={handleChangeAmount}
                                                                variant={'info'}
                                                                size="sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pb-3">
                                                    <div class="col d-grid">
                                                        <button class="btn btn-danger btn-lg"
                                                            onClick={buyNow} value="buy">Mua ngay
                                                        </button>
                                                    </div>
                                                    <div class="col d-grid">
                                                        <button type="submit" class="btn btn-danger btn-lg"
                                                            name="submit" onClick={handleSubmitAdd}>Giỏ hàng
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form>}

                                        </div>
                                    </div>
                                </div>
                                :
                                <div class="col-lg-7 mt-5">
                                    <div class="card">
                                        <div class="card-body" style={{ background: " #f8d7da", color: " #721c24" }}>
                                            <h6>Hết hàng</h6>
                                        </div>
                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                </Modal.Body>
                :
                <Modal.Body>
                    <div className="container pb-5">
                        <img class="card-img img-fluid" src={imgSelect} width="400" alt="Card image cap"
                            id="product-detail" />
                    </div>
                </Modal.Body>
            }
        </Modal>
        </>
    )
};


export default userLayout(SearchPage)