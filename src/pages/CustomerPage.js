import React, { useEffect, useState } from "react";
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import ReactLoading from "react-loading"


const CustomerPage = () => {
    const [listCustomer, setListCustomer] = useState([]);
    const [load, setLoad] = useState(false);
    async function getCustomer() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/all`)
        setLoad(true);
        setListCustomer(result?.data?.data);
    }

    useEffect(() => {
        getCustomer();
    }, []);

    return(
        <>
            {
            load ?
                <div>
                    <div className="table-container" style={{ width: '100%' }}>
                        <div className="row">
                            <div className="col text-center">
                                <h5 className="pb-2 mb-0">Danh sách khách hàng</h5>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto">
                            <table className="table table-image">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1">ID</th>
                                        <th scope="col" className="col-2">Tên khách hàng</th>
                                        <th scope="col" className="col-1">Địa chỉ</th>
                                        <th scope="col" className="col-2">Số ĐT</th>
                                        <th scope="col" className="col-1">Email</th>
                                        <th scope="col" className="col-1">Username</th>
                                        <th scope="col" className="col-1">Tích lũy</th>
                                        <th scope="col" className="col-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCustomer.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td className="tdName">{item.firstname} {item.lastname} </td>
                                            <td className="tdImage w-25">{item.address}</td>
                                            <td className="tdCategory">{item.phone}</td>
                                            <td className="tdPrice">{item.accountModel.email}</td>
                                            <td className="tdPrice">{item.accountModel.username}</td>
                                            <td className="tdPrice">{item.customerPointModel.points} đ</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {item.accountModel.activity ?
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
                    </div>
                </div>
                :
                <div className={"center loading"}>
                    <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                </div>
            }
        </>
    )
};

export default adminLayout(CustomerPage);