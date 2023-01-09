import React from "react";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
    DataGrid,
    GridColDef,
    GridApi,
    GridCellParams,
} from "@mui/x-data-grid";
import Skeleton from "@mui/material/Skeleton";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from "@mui/lab/LoadingButton";

import { useGetCustomersQuery, useAddCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, selectAllCustomers } from "../../slices/Customer.slice";
import { Customer } from "../../types/customer/Customer.type";
import Layout from "../dashboard/Layout";

const CustomerSchema: yup.SchemaOf<Customer> = yup
    .object({
        full_name: yup.string().trim().required("Full Name is required").defined(),
        phone_number: yup
            .string()
            .trim()
            .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
                message:
                    "Enter a Valid Phone Number. ex: +123456890 (with Country Code)",
                excludeEmptyString: false,
            })
            .required("Phone Number is required")
            .defined(),
        address: yup.string().trim().required("Address is required").defined(),
    })
    .defined();

const CustomerHome: React.FC<{}> = () => {
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "string",
        },
        {
            field: "full_name",
            headerName: "Name",
            type: "string",
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            type: "string",
        },
        {
            field: "address",
            headerName: "Address",
            type: "string",
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            renderCell: (params) => {
                const onClickEdit = (e: any) => {
                    e.stopPropagation();

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellParams> = {};

                    api
                        .getAllColumns()
                        .filter((c: any) => c.field)
                        .forEach(
                            (c: any) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );
                    setCustomerID(thisRow.id)
                    setCustomerName(thisRow.full_name)
                    setCustomerPhoneNumber(thisRow.phone_number)
                    setCustomerAddress(thisRow.address)
                    setOpenModalEdit(true);
                }
                const onClickDelete = async (e: any) => {
                    e.stopPropagation();

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellParams> = {};

                    api
                        .getAllColumns()
                        .filter((c: any) => c.field)
                        .forEach(
                            (c: any) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    await deleteCustomer(thisRow.id);
                    return;
                };

                return (
                    <>
                        <Button onClick={onClickEdit}>Edit</Button>
                        <Button onClick={onClickDelete}>Remove</Button>
                    </>
                );
            },
        },
    ];

    const [addCustomer, { isLoading }] = useAddCustomerMutation();
    const { isLoading: customerLoading } = useGetCustomersQuery();
    const [deleteCustomer, { isLoading: onDeleteCustomer }] = useDeleteCustomerMutation();
    const [updateCustomer, { isLoading: onUpdateCustomer }] = useUpdateCustomerMutation();
    const getAllCustomers = useSelector(selectAllCustomers);
    const [filterTerm, setFilterTerm] = useState<string>("");
    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

    const [customerID, setCustomerID] = useState<any>("");
    const [customerName, setCustomerName] = useState<any>("");
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState<any>("");
    const [customerAddress, setCustomerAddress] = useState<any>(0);

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
    };
    const filterCustomerByName = (full_name: string) => {
        if (Array.isArray(getAllCustomers)) {
            if (!full_name) {
                return getAllCustomers;
            }
            return getAllCustomers.filter((customer: any) => customer.full_name.includes(full_name));
        }
    };

    const filteredCustomers: any = filterCustomerByName(filterTerm);

    const addCustomerForm = useFormik({
        initialValues: {
            full_name: "",
            phone_number: "",
            address: "",
        },
        validateOnChange: false,
        validationSchema: CustomerSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const addCustomerResponse = await addCustomer({
                full_name: values.full_name,
                phone_number: values.phone_number,
                address: values.address,
            });
            if (addCustomerResponse.error) {
                // setShowAlert(true);
                // setErrorMessage(signUpResponse.error.data);
            } else {
                // setShowAlert(false);
                setSubmitting(false);
                resetForm();
            }
        },
    });
    const updateCustomerForm = useFormik({
        initialValues: {
            id: customerID,
            full_name: customerName,
            phone_number: customerPhoneNumber,
            address: customerAddress,
        },
        enableReinitialize: true,
        validationSchema: CustomerSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const updateCustomerResponse = await updateCustomer({
                id: values.id,
                full_name: values.full_name,
                phone_number: values.phone_number,
                address: values.address,
            });
            if (updateCustomerResponse.error) {
                // setShowAlert(true);
                // setErrorMessage(signUpResponse.error.data);
            } else {
                // setShowAlert(false);
                setSubmitting(false);
                resetForm();
                handleCloseModalEdit();
            }
        },
    });

    return (
        <>
            <Layout>
                <Dialog
                    open={openModalEdit}
                    onClose={handleCloseModalEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Edit Product"}
                    </DialogTitle>
                    <form onSubmit={updateCustomerForm.handleSubmit}>
                        <DialogContent>
                            <Stack spacing={3}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    label="Full Name"
                                    value={updateCustomerForm.values.full_name}
                                    onChange={updateCustomerForm.handleChange}
                                    error={
                                        updateCustomerForm.touched.full_name &&
                                        Boolean(updateCustomerForm.errors.full_name)
                                    }
                                    // helperText={
                                    //     updateCustomerForm.touched.sku &&
                                    //     updateCustomerForm.errors.sku
                                    // }
                                    variant="standard"
                                    autoFocus
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    label="Phone Number"
                                    value={updateCustomerForm.values.phone_number}
                                    onChange={updateCustomerForm.handleChange}
                                    error={
                                        updateCustomerForm.touched.phone_number &&
                                        Boolean(updateCustomerForm.errors.phone_number)
                                    }
                                    // helperText={
                                    //     updateCustomerForm.touched.name &&
                                    //     updateCustomerForm.errors.name
                                    // }
                                    variant="standard"
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="text"
                                    id="address"
                                    name="address"
                                    label="Address"
                                    value={updateCustomerForm.values.address}
                                    onChange={updateCustomerForm.handleChange}
                                    error={
                                        updateCustomerForm.touched.address &&
                                        Boolean(updateCustomerForm.errors.address)
                                    }
                                    // helperText={
                                    //     updateCustomerForm.touched.stock && updateCustomerForm.errors.stock
                                    // }
                                    variant="standard"
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModalEdit}>Cancel</Button>
                            {!isLoading && (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className="drop-shadow-2xl rounded-2xl bg-black py-3 mt-6 text-base font-semibold capitalize"
                                >
                                    Save Customer
                                </Button>
                            )}
                            {isLoading && (
                                <LoadingButton
                                    loading
                                    loadingIndicator="Saving..."
                                    variant="outlined"
                                >
                                    Saving
                                </LoadingButton>
                            )}
                        </DialogActions>
                    </form>
                </Dialog>
                {!customerLoading && !onDeleteCustomer ? (
                    <div style={{ height: 500 }}>
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="name"
                            name="name"
                            label="Search Customer by Name"
                            variant="standard"
                            value={filterTerm}
                            onChange={(e: any) => {
                                setFilterTerm(e.target.value);
                            }}
                        />
                        <DataGrid
                            rows={filteredCustomers}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            getRowId={(row: any) => row.id}
                            disableSelectionOnClick
                        />
                    </div>
                ) : (
                    <Skeleton variant="rectangular" height={500} />
                )}
                <form onSubmit={addCustomerForm.handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="full_name"
                            name="full_name"
                            label="Full Name"
                            value={addCustomerForm.values.full_name}
                            onChange={addCustomerForm.handleChange}
                            error={
                                addCustomerForm.touched.full_name &&
                                Boolean(addCustomerForm.errors.full_name)
                            }
                            helperText={
                                addCustomerForm.touched.full_name &&
                                addCustomerForm.errors.full_name
                            }
                            variant="standard"
                            autoFocus
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            label="Phone Number"
                            value={addCustomerForm.values.phone_number}
                            onChange={addCustomerForm.handleChange}
                            error={
                                addCustomerForm.touched.phone_number &&
                                Boolean(addCustomerForm.errors.phone_number)
                            }
                            helperText={
                                addCustomerForm.touched.phone_number &&
                                addCustomerForm.errors.phone_number
                            }
                            variant="standard"
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="address"
                            name="address"
                            label="Address"
                            value={addCustomerForm.values.address}
                            onChange={addCustomerForm.handleChange}
                            error={
                                addCustomerForm.touched.address &&
                                Boolean(addCustomerForm.errors.address)
                            }
                            helperText={
                                addCustomerForm.touched.address && addCustomerForm.errors.address
                            }
                            variant="standard"
                        />
                        {!isLoading && (
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="drop-shadow-2xl rounded-2xl bg-black py-3 mt-6 text-base font-semibold capitalize"
                            >
                                Save Customer
                            </Button>
                        )}
                        {isLoading && (
                            <LoadingButton
                                loading
                                loadingIndicator="Saving..."
                                variant="outlined"
                            >
                                Saving
                            </LoadingButton>
                        )}
                    </Stack>
                </form>
            </Layout>
        </>
    )
}

export default CustomerHome;

