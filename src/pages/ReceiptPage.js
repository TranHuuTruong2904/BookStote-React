import React, { useState, useEffect } from "react";
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import axios from "../api/axios";
import { toast } from 'react-toastify';
import { Button, Form, Modal } from "react-bootstrap"
import { useLocation } from "react-router-dom";
import ReactLoading from "react-loading";

const ReceiptPage = () => {

    const param = useLocation();

    const [load, setLoad] = useState(false);
    const [listReceipt, setListReceipt] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const listColor = [
        { "id": 0, "color": 'đen trắng' }, { "id": 1, "color": 'có màu' },
        { "id": 2, "color": 'Bản đặc biệt' }, { "id": 3, "color": 'Màu 3D' }
        , { "id": 4, "color": 'Màu xanh' }, { "id": 5, "color": 'Màu đỏ' }
        , { "id": 6, "color": 'bìa cứng' }, { "id": 7, "color": 'bìa mềm' }
    ];

    const listSize = [
        { "id": 0, "size": '20cm x 24cm' }, { "id": 1, "size": '18cm x 20cm' },
        { "id": 2, "size": '10cm' }, { "id": 3, "size": '8cm' },
        { "id": 4, "size": '5cm' }
    ];
    const [show, setShow] = useState(false);
    const [rows, newRows] = useState([{}])
    const handleAddRow = () => {
        newRows(prev => [...prev, {}])
    }
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
    }

    const handleShowInfo = (e) => {

        setShow(true);
    }
    const handleShowAdd = (e) => {
        setShow(true);

    }

    // function parents(node) {
    //     let current = node,
    //         list = [];
    //     while (current.parentNode != null && current.parentNode != document.documentElement) {
    //         list.push(current.parentNode);
    //         current = current.parentNode;
    //     }
    //     return list
    // }

    async function getListReceipt() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/ware-house/history_receipt`)
        setLoad(true);
        setListReceipt(result?.data)
    }

    async function getAllProduct() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/all`)
        result?.data?.data?.map(a => listProduct.push({ "id": a.id, "name": a.name }));
    }

    const handleSubmitReceipt = async (e) => {
        e.preventDefault(false);
        let result = null;
        const query = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/ware-house/import`, rows);
        if (query?.data?.status === 200)
            {toast.success(query?.data?.message)
            newRows([{}]);
            setShow(false);}
        else
            toast.error(query?.data?.message + "! Vui lòng thử lại")

        getListReceipt();
    }

    useEffect(() => {
        getListReceipt();
        getAllProduct();
    }, []);

    console.log(rows);

    return (
        <>
            {
                load ?
                    <div>
                        <div className="table-container" style={{ width: '100%' }}>
                            <div className="row">
                                <div className="col">
                                    <h5 className="pb-2 mb-0">Danh sách đơn nhập hàng</h5>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn" onClick={handleShowAdd}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex text-muted overflow-auto">
                                <table className="table table-image">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-3">Mã phiếu nhập</th>
                                            <th scope="col" className="col-4">Ngày nhập</th>
                                            <th scope="col" className="col-3">Tổng số sản phẩm</th>
                                            <th scope="col" className="col-2">Tổng tiền </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listReceipt.map((item) => (
                                            <tr key={item.id}>
                                                <th scope="row">{item?.id}</th>
                                                <td className="tdName">{item?.createdDate}</td>
                                                <td className="tdName">{item?.totalAmount}</td>
                                                <td className="tdDescribe">{item?.totalMoney.toLocaleString('vi', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                </td>
                                            </tr>))}

                                    </tbody>
                                </table>
                            </div>
                            {/*<Pagination refix='product' size={totalPage}/>*/}
                        </div>
                        <Modal show={show} onHide={handleClose} className="custom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Nhập hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-4">
                                                    Sản phẩm
                                                    <i className="fa fa-plus ms-3 add_row" onClick={handleAddRow}></i>
                                                </th>
                                                <th scope="col" className="col-2">Size</th>
                                                <th scope="col" className="col-2">Màu</th>
                                                <th scope="col" className="col-2">Số lượng</th>
                                                <th scope="col" className="col-2">Giá nhập</th>
                                                <th></th>
                                            </tr>

                                        </thead>
                                        <tbody id="table">
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td><Form.Group className="mb-4">
                                                        <Form.Control as="select" name="product_id" required onChange={e => {
                                                            rows[index].product_id = e.target.value
                                                        }}>
                                                            <option value="">Sản phẩm</option>
                                                            {listProduct.map(i => rows[index].product_id == i.id ?
                                                                <option value={i?.id} selected>{i?.name}</option>
                                                                :
                                                                <option value={i?.id}>{i?.name}</option>
                                                            )}
                                                        </Form.Control>
                                                    </Form.Group>
                                                    </td>
                                                    <td><Form.Group className="mb-2">
                                                        <Form.Control as="select" name="size" required onChange={e => {
                                                            rows[index].size = e.target.value
                                                        }}>
                                                            <option value="">Size</option>
                                                            {listSize.map(item => rows[index].size == item?.size ?
                                                                <option value={item?.size} selected>{item?.size}</option>
                                                                :
                                                                <option value={item?.size}>{item?.size}</option>
                                                            )}
                                                        </Form.Control>
                                                    </Form.Group>
                                                    </td>
                                                    <td><Form.Group className="mb-2">
                                                        <Form.Control as="select" name="color" required onChange={e => {
                                                            rows[index].color = e.target.value
                                                        }}>
                                                            <option value="">Màu</option>
                                                            {listColor.map(item =>
                                                                rows[index].size == item?.color ?
                                                                    <option value={item?.color} selected>{item?.color}</option>
                                                                    :
                                                                    <option value={item?.color}>{item?.color}</option>
                                                            )}
                                                        </Form.Control>
                                                    </Form.Group>
                                                    </td>
                                                    <td><Form.Group className="mb-2">
                                                        <Form.Control type="number" placeholder="Số lượng" name="amount"
                                                            onChange={e => {
                                                                rows[index].numberAdd = e.target.value
                                                            }} value={rows[index].numberAdd} />
                                                    </Form.Group>
                                                    </td>
                                                    <td><Form.Group className="mb-2">
                                                        <Form.Control type="text" placeholder="Giá " name="price"
                                                            onChange={e => {
                                                                rows[index].prices = e.target.value
                                                            }} value={rows[index].prices} />
                                                    </Form.Group>
                                                    </td>
                                                    <td><span onClick={() => {
                                                        const updatedRows = [...rows]; // Tạo một bản sao mới của mảng rows
                                                        updatedRows.splice(index, 1); // Xóa phần tử khỏi mảng
                                                        newRows(updatedRows); // Cập nhật lại state rows bằng hàm newRows
                                                    }}><i className="fa fa-times"></i></span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Button variant="success" type="submit"
                                     onClick={handleSubmitReceipt}
                                    >
                                        Tạo đơn nhập
                                    </Button>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    :
                    <div className={"center loading"}>
                        <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                    </div>
            }
        </>
    )
};

export default adminLayout(ReceiptPage);