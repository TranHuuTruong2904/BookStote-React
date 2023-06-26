import React, { useEffect, useState } from "react";
import adminLayout from "../admin/adminLayout";
import { useLocation } from "react-router-dom";
import axiosApiInstance from "../context/interceptor";
import Pagination from "../components/Pagination";
import ReactLoading from "react-loading"
import { Button, Form, Modal } from "react-bootstrap"

const ProductPage = () => {
    const param = useLocation();
    const [list, setList] = useState([]);
    const [load, setLoad] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [productDetail, setProductDetail] = useState([]);
    const [listCate, setListCate] = useState([]);
    const [modalForm, setModalForm] = useState(false);

    const [product_id, setId] = useState();
    const [images, setImages] = useState([]);
    const [product_name, setName] = useState();
    const [product_image, setImage] = useState();
    const [product_category, setCategory] = useState();
    const [product_sold, setSold] = useState();
    const [product_describe, setDescribe] = useState();
    const [show, setShow] = useState(false);

    const [editForm, setEditForm] = useState(false);

    const handleClose = () => setShow(false);

    function parents(node) {
        let current = node,
            list = [];
        while (current.parentNode != null && current.parentNode != document.documentElement) {
            list.push(current.parentNode);
            current = current.parentNode;
        }
        return list
    }

    const handleShowAdd = (e) => {
        setModalForm(true);
        setShow(true);
        setEditForm(false);
        setId(null);
        setName(null);
        setDescribe(null);
        setCategory(null);
        setSold(null);
        setImage(null);

    }

    async function getProduct(page, size) {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/get_paging${page}&size=${size}`)
        setLoad(true);
        setList(result?.data?.content);
        setTotalPage(result?.data?.totalPages);
    }

    async function getCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category/all`)
        setLoad(true);
        setListCate(result?.data?.data)
    }

    async function getDetails(id) {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/detail/${id}`)
        setLoad(true);
        setProductDetail(result?.data?.data)
        console.log(result)
    }

    const handleShowInfo = (e) => {
        setModalForm(false);

        setImage(null)
        const tmpID = parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[0].innerText;
        setId(tmpID)
        getDetails(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[0].innerText);
        setName(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[1].innerText)
        setImage(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[2].firstChild.currentSrc)
        setCategory(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[3].innerText)
        setSold(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[4].innerText)
        setDescribe(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[5].innerText)

        setShow(true);
    }

    const handleShow = (e) => {
        setModalForm(true);
        setImage(null);
        setId(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[0].innerText)
        setName(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[1].innerText)
        setImage(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[2].firstChild.currentSrc)
        setCategory(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[3].innerText)
        setSold(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[4].innerText)
        setDescribe(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[5].innerText)
        const tag = parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[6].innerText;
      
        setShow(true);
        setEditForm(true);
    }

    useEffect(() => {
        getProduct(param.search === '' ? '?page=1' : param.search, 6);
        getCategory();
    }, [param]);

    return (
        <>
            {
            load ?
                <div>
                    <div className="table-container" style={{ width: '100%' }}>
                        <div className="row">
                            <div className="col">
                                <h5 className="pb-2 mb-0">Danh sách sản phẩm</h5>
                            </div>
                            <div className="col text-right">
                                <button className="btn btn-default low-height-btn" 
                                onClick={handleShowAdd}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto">
                            <table className="table table-image">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1">Mã sản phẩm</th>
                                        <th scope="col" className="col-3">Tên sản phẩm</th>
                                        <th scope="col" className="col-1">Hình ảnh</th>
                                        <th scope="col" className="col-2">Danh mục</th>
                                        <th scope="col" className="col-1">Giá bán</th>
                                        <th scope="col" className="col-1">Tồn Kho</th>
                                        <th style={{ display: 'none' }} scope="col" className="col-1">Mô tả</th>
                                        <th style={{ display: 'none' }} scope="col" className="col-1">Tag</th>
                                        <th scope="col" className="col-2">Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td className="tdName">{item.name}</td>
                                            <td className="tdImage w-25">
                                                <img
                                                    src={item.linkImg}
                                                    width="50" height="50" className="img-fluid img-thumbnail"
                                                    alt="Sheep" />
                                            </td>
                                            <td className="tdCategory">{item.category}</td>
                                            <td className="tdPrice">{item.price.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</td>
                                            <td style={{ display: 'none' }} className="tdDescribe">{item.describe}</td>
                                            <td style={{ display: 'none' }} className="tdDescribe">{item.tag}</td>
                                            <td className="tdPrice">{item?.quantityInStock}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <button type="button"
                                                    className="btn btn-outline-primary btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chi tiết" 
                                                    onClick={handleShowInfo}
                                                    ><i className="fa fa-info"
                                                        aria-hidden="true"></i>
                                                </button>
                                                <button type="button"
                                                    className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chỉnh sửa" 
                                                    onClick={handleShow}
                                                    ><i className="fa fa-pencil"
                                                        aria-hidden="true"></i>
                                                </button>
                                                {item.status === false ?
                                                    <button type="button"
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Mở khóa" 
                                                        // onClick={handleUnBlock}
                                                        ><i className="fa fa-unlock"
                                                            aria-hidden="true"></i>
                                                    </button> :
                                                    <button type="button"
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Khóa" 
                                                        // onClick={handleBlock}
                                                        ><i className="fa fa-lock"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                }

                                            </td>
                                        </tr>))}

                                </tbody>
                            </table>
                        </div>
                        <Pagination refix='product' size={totalPage} />
                    </div>
                    {modalForm ?
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Quản lý sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form 
                                // onSubmit={handleSubmit}
                                >
                                    <Form.Group className="mb-2">
                                        <Form.Control type="text" placeholder="Tên sản phẩm" name="name" required
                                            value={product_name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Control as="select" name="category" required value={product_category}
                                            onChange={(e) => setCategory(e.target.value)} id="select">
                                            <option value="">Danh mục</option>
                                            {listCate.map((cate) => (
                                                <option value={cate.name} key={cate.id}>{cate.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        {product_image ? (<ul className="list-images">
                                            <li><img src={product_image} /></li>
                                        </ul>) : null}
                                        {images.length > 0 ?
                                            <ul className="list-images">
                                                {
                                                    images.map((image, index) => {
                                                        return <li key={index}><img src={image} /></li>
                                                    })
                                                }
                                            </ul> : null
                                        }
                                        <Form.Control type="file" id="file" 
                                        // onChange={changeHandler}
                                            accept="image/png, image/jpg, image/jpeg" multiple />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Control type="text" placeholder="Mô tả" name="id" required
                                            value={product_describe}
                                            onChange={(e) => setDescribe(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Control type="number" placeholder="Giá " name="price" value={product_sold}
                                            onChange={(e) => setSold(e.target.value)} />
                                    </Form.Group>
                                    
                                    <Button variant="success" type="submit">
                                        {editForm ? "Chỉnh sửa" : "Tạo sản phẩm"}
                                    </Button>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        :
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Chi tiết sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>Tên Sản phẩm : <strong>{product_name}</strong></div>
                                <div>Mô tả: <strong>{product_describe}</strong></div>
                                <table className="table mt-3">
                                    <thead>
                                        <tr bgcolor="Silver">
                                            <th scope="col" className="col-2">Size</th>
                                            <th scope="col" className="col-2">Màu</th>
                                            <th scope="col" className="col-2">Số lượng</th>
                                        </tr>
                                    </thead>
                                    {productDetail.map(item =>
                                        <tbody>
                                            <tr>
                                                <td>{item.size}</td>
                                                <td>{item.color}</td>
                                                <td className="px-4">{item.current_number}</td>
                                            </tr>
                                        </tbody>
                                    )}

                                </table>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
                :
                <div className={"center loading"}>
                    <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                </div>
            }
        </>
    )
};

export default adminLayout(ProductPage);