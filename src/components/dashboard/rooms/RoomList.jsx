import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { BiCommentDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import RoomService from "../../../services/RoomService";
import RoomTypeService from "../../../services/RoomTypeService";
import SearchIcon from '@mui/icons-material/Search';
import ModalEditRoom from "./ModalEditRoom";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import RoomRealService from "../../../services/RoomRealService";

export default function RoomList() {
    const [roomList, setRoomList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const [roomInfo, setRoomInfo] = useState({})
    const [filters, setFilters] = useState({
        direction: '',
        page: 0,
        size: 5,
        kw: "",
        roomType: "",
        sortByField: "id",        // name, price
        orderBySort: "asc",        // desc, asc
        minPrice: "",
        maxPrice: "",
    })
    const [totalPages, setTotalPages] = useState(0)
    const [roomTypeList, setRoomTypeList] = useState([]);
    const [keyword, setKeyword] = useState(null)
    const [selectDate, setSelectDate] = useState([
        dayjs(),
        dayjs().add(1, 'day')
    ])
    const [loadingSelectDay,setLoadingSelectDay] = useState(false)
    const selectFirstDay = selectDate[0];
    const selectLastDay = selectDate[1];
    console.log("selectDate", selectDate);
    const [objSelectDay, setObjSelectDay] = useState({
        selectFirstDay: selectFirstDay.toDate(),
        selectLastDay: selectLastDay.toDate()
    })
    console.log("objSelectDay", objSelectDay);
    const handleClickSelectDay = (newDates) => {
        setSelectDate(newDates)
        const [firstDay, lastDay] = newDates;
        setObjSelectDay({
            selectFirstDay: firstDay.toDate(),
            selectLastDay: lastDay.toDate()
        });
        setLoadingSelectDay(true)
        console.log("load",loadingSelectDay);
    }
    function calculateUrl(filters) {
        let urlArray = [];
        if (filters.kw !== "") {
            urlArray.push(`kw=${filters.kw}`)
        }
        urlArray.push(`page=${filters.page}`);
        urlArray.push(`size=${filters.size}`);
        if (filters.statusRoom !== "") {
            urlArray.push(`statusRoom=${filters.statusRoom}`);
        }
        if (filters.roomType !== "") {
            urlArray.push(`roomType=${filters.roomType}`);
        }
        urlArray.push(`sort=${filters.sortByField},${filters.orderBySort}`);

        return urlArray.join("&");
    }

    useEffect(() => {
        setLoading(true)
        async function getFilter() {
            let dataRoomType = await RoomTypeService.getAllRoomType()
            setRoomTypeList(dataRoomType?.data)
            setLoading(false)
        }
        getFilter()
    }, [])
    useEffect(() => {
        async function getAllRoomFilter() {
            try {
                let roomFilters = await RoomService.getAllRoomByFilter(`/rooms/filters?` + calculateUrl(filters))
                let result = roomFilters?.data?.content
                let totalPage = roomFilters?.data?.totalPages
                setTotalPages(totalPage)
                setRoomList(result)
            } catch (error) {
                console.log("error", error);
                toast.error('Lỗi dữ liệu/ hệ thống')
            }
        }
        getAllRoomFilter()
    }, [filters, totalPages, roomInfo])
    useEffect(() => {
        setLoading(true)
        async function postFindAvailableRoomRealNoRoomId() {
            try {
                console.log("objSelectDayobjSelectDay",objSelectDay);
                let roomrealRes = await RoomRealService.postFindAvailableRoomReal(objSelectDay)
                let result = roomrealRes?.data
                console.log("roomrealRes result", result);
                setLoading(false)

            } catch (error) {
                console.log("error", error);
                toast.error('Lỗi dữ liệu/ hệ thống')
                setLoading(false)
            }
        }
        postFindAvailableRoomRealNoRoomId()
    }, [objSelectDay])
    const handleClickNextPage = () => {
        if (Number(filters.page) < totalPages) {
            setFilters({
                ...filters,
                page: Number(filters.page) + 1,
                direction: 'next'
            })
        }
    }
    const handleClickPrevPage = () => {
        if (Number(filters.page) > 0) {
            setFilters({
                ...filters,
                page: Number(filters.page) - 1,
                direction: 'prev'
            })
        }
    }
    const handleClickPageNumber = (pageNumber) => {
        setFilters({
            ...filters,
            page: Number(pageNumber)
        })
    }
    const handleShowModalEditRoom = (roomInfo) => {
        setShow(true)
        setRoomInfo(roomInfo)
    }
    const handleRemoveRoom = () => { }

    const handleSearchText = (e) => {
        setKeyword(e.target.value)
    }
    const handleSearch = (e) => {
        e.preventDefault()
        setFilters({
            ...filters,
            kw: keyword
        })
    }
    const handleFilterRoomType = (e) => {
        setFilters({
            ...filters,
            roomType: e.target.value
        })
    }
    const handleSelectLimit = (e) => {
        setFilters({
            ...filters,
            size: e.target.value
        })
    }
    const handleClickOrder = (e) => {
        setFilters({
            ...filters,
            orderBySort: e.target.value
        })
    }
    const handleClickSort = (e) => {
        setFilters({
            ...filters,
            sortByField: e.target.value
        })
    }


    return (
        <>

            {
                loading ? (<span className="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></span>) :
                    (
                        <>
                            <div className="d-flex justify-content-center">
                                <div className="d-flex me-2 algin-items-center my-2 justify-content-center ">

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangePicker']}>
                                            <DateRangePicker
                                                value={selectDate}
                                                onChange={handleClickSelectDay}
                                                localeText={{ start: 'From', end: 'To' }}

                                            />

                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">

                                <div className="d-flex me-2 algin-items-center my-2 justify-content-center ">
                                    <form className="d-flex align-items-center " onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            placeholder="Search Room By Name"
                                            className="form-control form-control-sm "
                                            onInput={handleSearchText}
                                        />
                                        <SearchIcon style={{ marginLeft: '-25px', marginTop: '2px', fontSize: '27px' }} />
                                        <input type="button" value="search" style={{ marginLeft: '5px' }} />
                                    </form>
                                </div>

                                <div className="d-flex me-2 algin-items-center my-2 justify-content-end">
                                    <div className="d-flex me-2 algin-items-center ">
                                        <div className="row me-2">
                                            <div className="d-flex me-2 algin-items-center justify-content-center my-1 ">
                                                <label className="form-label me-2 d-flex justify-content-center" style={{ marginTop: '5px' }} >Filter</label>

                                                <select defaultValue={""}
                                                    onChange={handleFilterRoomType}
                                                    className="me-1"
                                                >
                                                    <option value="">Room type</option>
                                                    {
                                                        roomTypeList?.map((stt) => (
                                                            <option className="d-flex justify-content-center algin-items-center" key={stt?.eroomName} value={stt?.eroomName}>{stt?.eroomTitle}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           {
                            loadingSelectDay? <button onClick={setLoadingSelectDay(false)}></button>:(
                                <Table size="small" className="table table-bordered table-striped table-hover rounded-3 overflow-hidden">
                                <TableHead >
                                    <TableRow className="table-secondary">
                                        <TableCell className="text-center">Id</TableCell>
                                        <TableCell className="text-center">Name</TableCell>
                                        <TableCell className="text-center">Type</TableCell>
                                        <TableCell className="text-center">Per type</TableCell>
                                        <TableCell className="text-center">Sleeper</TableCell>
                                        <TableCell className="text-center">Price</TableCell>
                                        <TableCell className="text-center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {

                                        roomList?.map((room) => (
                                            <>

                                                <TableRow key={`room_${room?.id}`}>
                                                    <TableCell className="text-center">{room?.id}</TableCell>
                                                    <TableCell className="text-center align-middle">{room?.name}</TableCell>
                                                    <TableCell className="text-center align-middle">{room?.roomType}</TableCell>
                                                    <TableCell className="text-center align-middle">{room?.perType?.name}</TableCell>
                                                    <TableCell className="text-center align-middle">{room?.sleep}</TableCell>
                                                    <TableCell className="text-center align-middle">{room?.pricePerNight}</TableCell>
                                                    <TableCell className="text-center d-flex align-items-center">
                                                        <Link className="mx-1" to={`/dashboard/rooms/${room?.id}`}>
                                                            <BiCommentDetail style={{ color: 'orange' }} size={22} title={room?.id} role="button"
                                                            />
                                                        </Link>
                                                        <div className="mx-1">
                                                            <div onClick={() => handleShowModalEditRoom(room)} role="button" title="edit">
                                                                <EditIcon
                                                                    style={{ color: 'green' }}
                                                                    size={22}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mx-1">
                                                            <PlaylistRemoveIcon style={{ color: 'red' }} size={22} title="remove" role="button"
                                                                onClick={() => handleRemoveRoom(room)} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </>

                                        ))}
                                </TableBody>
                            </Table >
                            )
                           }
                        </>
                    )
            }
            <div className="d-flex align-items-center justify-content-between">
                <ul className="pagination">
                    {
                        filters.page < 1 ? "" :
                            (<li className="page-items">
                                <button
                                    onClick={handleClickPrevPage}
                                    className={`page-link ${filters.page >= 1 ? 'disabled' : (filters.direction !== "prev" ? ' ' : 'active')}`}
                                >prev</button>
                            </li>)
                    }
                    {[...Array(totalPages).keys()].map((pageNumber) => (
                        <li key={pageNumber} className="page-items">
                            <button
                                onClick={() => handleClickPageNumber(pageNumber)}
                                className={`page-link ${filters.page === pageNumber ? 'active' : ''}`}
                            >{pageNumber + 1}</button>
                        </li>
                    ))}
                    {
                        filters.page >= totalPages - 1 ? "" :
                            (<li className="page-items">
                                <button
                                    onClick={handleClickNextPage}
                                    className={`page-link  ${filters.page >= totalPages ? 'disabled' : (filters.direction !== "next" ? '' : 'active')}`}
                                >next</button>
                            </li>)
                    }

                </ul>
                <div className="d-flex align-items-center ">
                    <span style={{ width: '45px' }}>Limit</span>
                    <select
                        className="form-select form-select-sm" style={{ width: '70px' }}
                        defaultValue={5}
                        onChange={handleSelectLimit}
                    >
                        <option value={5} className={`${filters.limit === 5 ? 'action' : ''}`} >5</option>
                        <option value={10} className={`${filters.limit === 10 ? 'action' : ''}`} >10</option>
                        <option value={25} className={`${filters.limit === 25 ? 'action' : ''}`} >25</option>
                        <option value={50} className={`${filters.limit === 50 ? 'action' : ''}`} >50</option>
                        <option value={100} className={`${filters.limit === 100 ? 'action' : ''}`} >100</option>
                    </select>
                </div>
                <div className="d-flex algin-items-center">
                    <div className="d-flex me-2 algin-items-center ">
                        <span style={{ width: '40px', marginTop: '5px' }}>Sort</span>
                        <select defaultValue={""} className="form-select form-select-sm " style={{ width: '120px' }}
                            onChange={handleClickSort}
                        >
                            <option value="">Select Filter</option>
                            <option value="name">Name</option>
                            <option value="pricePerNight">Price</option>
                        </select>
                    </div>
                    <div className="d-flex me-2 algin-items-center ">
                        <span style={{ width: '50px', marginTop: '5px' }}>Order</span>
                        <select defaultValue={"asc"} className="form-select form-select-sm " style={{ width: '120px' }}
                            onChange={handleClickOrder}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>
            <ModalEditRoom show={show} handleClose={setShow} roomInfo={roomInfo} setRoomInfo={setRoomInfo} />
        </>
    );
}
