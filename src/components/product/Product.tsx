import React from "react";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
// import IconButton from "@mui/material/IconButton";
// import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import InputAdornment from "@mui/material/InputAdornment";
// import Typography from "@mui/material/Typography";
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
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Collapse from "@mui/material/Collapse";
// import CloseIcon from "@mui/icons-material/Close";
// import Divider from "@mui/material/Divider";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";

import { Product } from "../../types/product/Product.type";
import {
    useAddProductMutation, useGetProductsQuery,
    selectAllProducts, useUpdateProductMutation,
    useDeleteProductMutation,
} from "../../slices/Product.slice";
import Layout from "../dashboard/Layout";

const ProductSchema: yup.SchemaOf<Product> = yup
    .object({
        sku: yup.string().trim().required("SKU is required").defined(),
        name: yup.string().trim().required("Name is required").defined(),
        stock: yup.number().min(0, 'Negative value is not allowed').required("Stock is required").defined(),
        price: yup.number().min(0, 'Negative value is not allowed').required("Stock is required").defined(),
        purchase: yup.number().min(0, 'Negative value is not allowed').required("Stock is required").defined(),
    })
    .defined();

const ProductHome: React.FC<{}> = () => {
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "string",
        },
        {
            field: "sku",
            headerName: "SKU",
            type: "string",
        },
        {
            field: "name",
            headerName: "Name",
            type: "string",
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
        },
        {
            field: "purchase",
            headerName: "Purchase",
            type: "number",
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
                    setProductID(thisRow.id)
                    setProductSKU(thisRow.sku)
                    setProductName(thisRow.name)
                    setProductStock(thisRow.stock)
                    setProductPrice(thisRow.price)
                    setProductPurchase(thisRow.purchase)
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

                    await deleteProduct(thisRow.id);
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
    // const navigate = useNavigate();
    const [addProduct, { isLoading }] = useAddProductMutation();
    const { isLoading: productLoading } = useGetProductsQuery();
    const [deleteProduct, { isLoading: onDeleteProduct }] = useDeleteProductMutation();
    const [updateProduct, { isLoading: onUpdateProduct }] = useUpdateProductMutation();
    const getAllProducts = useSelector(selectAllProducts);
    const [filterTerm, setFilterTerm] = useState<string>("");
    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

    const [productID, setProductID] = useState<any>("");
    const [productSKU, setProductSKU] = useState<any>("");
    const [productName, setProductName] = useState<any>("");
    const [productStock, setProductStock] = useState<any>(0);
    const [productPrice, setProductPrice] = useState<any>(0);
    const [productPurchase, setProductPurchase] = useState<any>(0);

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
    };
    const filterProductBySKU = (sku: string) => {
        if (Array.isArray(getAllProducts)) {
            if (!sku) {
                return getAllProducts;
            }
            return getAllProducts.filter((product: any) => product.sku.includes(sku));
        }
    };

    const filteredProducts: any = filterProductBySKU(filterTerm);

    const addProductForm = useFormik({
        initialValues: {
            sku: "",
            name: "",
            stock: 0,
            price: 0,
            purchase: 0,
        },
        validationSchema: ProductSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const addProductResponse = await addProduct({
                sku: values.sku,
                name: values.name,
                stock: values.stock,
                price: values.price,
                purchase: values.purchase,
            });
            if (addProductResponse.error) {
                // setShowAlert(true);
                // setErrorMessage(signUpResponse.error.data);
            } else {
                // setShowAlert(false);
                setSubmitting(false);
                resetForm();
            }
        },
    });
    const updateProductForm = useFormik({
        initialValues: {
            id: productID,
            sku: productSKU,
            name: productName,
            stock: productStock,
            price: productPrice,
            purchase: productPrice,
        },
        enableReinitialize: true,
        validationSchema: ProductSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const updateProductResponse = await updateProduct({
                id: values.id,
                sku: values.sku,
                name: values.name,
                stock: values.stock,
                price: values.price,
                purchase: values.purchase,
            });
            if (updateProductResponse.error) {
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
                    <form onSubmit={updateProductForm.handleSubmit}>
                        <DialogContent>
                            <Stack spacing={3}>
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    label="SKU"
                                    value={updateProductForm.values.sku}
                                    onChange={updateProductForm.handleChange}
                                    error={
                                        updateProductForm.touched.sku &&
                                        Boolean(updateProductForm.errors.sku)
                                    }
                                    // helperText={
                                    //     updateProductForm.touched.sku &&
                                    //     updateProductForm.errors.sku
                                    // }
                                    variant="standard"
                                    autoFocus
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="text"
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={updateProductForm.values.name}
                                    onChange={updateProductForm.handleChange}
                                    error={
                                        updateProductForm.touched.name &&
                                        Boolean(updateProductForm.errors.name)
                                    }
                                    // helperText={
                                    //     updateProductForm.touched.name &&
                                    //     updateProductForm.errors.name
                                    // }
                                    variant="standard"
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    label="Stock"
                                    value={updateProductForm.values.stock}
                                    onChange={updateProductForm.handleChange}
                                    error={
                                        updateProductForm.touched.stock &&
                                        Boolean(updateProductForm.errors.stock)
                                    }
                                    // helperText={
                                    //     updateProductForm.touched.stock && updateProductForm.errors.stock
                                    // }
                                    variant="standard"
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="number"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    value={updateProductForm.values.price}
                                    onChange={updateProductForm.handleChange}
                                    error={
                                        updateProductForm.touched.price &&
                                        Boolean(updateProductForm.errors.price)
                                    }
                                    // helperText={
                                    //     updateProductForm.touched.price && updateProductForm.errors.price
                                    // }
                                    variant="standard"
                                />
                                <TextField
                                    autoComplete="off"
                                    fullWidth
                                    type="number"
                                    id="purchase"
                                    name="purchase"
                                    label="Purchase"
                                    value={updateProductForm.values.purchase}
                                    onChange={updateProductForm.handleChange}
                                    error={
                                        updateProductForm.touched.purchase &&
                                        Boolean(updateProductForm.errors.purchase)
                                    }
                                    // helperText={
                                    //     updateProductForm.touched.purchase && updateProductForm.errors.purchase
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
                                    Save Product
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
                {!productLoading && !onDeleteProduct ? (
                    <div style={{ height: 500 }}>
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="sku"
                            name="sku"
                            label="Search Product by SKU"
                            variant="standard"
                            value={filterTerm}
                            onChange={(e: any) => {
                                setFilterTerm(e.target.value);
                            }}
                        />
                        <DataGrid
                            rows={filteredProducts}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            getRowId={(row: any) => row.sku}
                            disableSelectionOnClick
                        />
                    </div>
                ) : (
                    <Skeleton variant="rectangular" height={500} />
                )}
                <form onSubmit={addProductForm.handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="sku"
                            name="sku"
                            label="SKU"
                            value={addProductForm.values.sku}
                            onChange={addProductForm.handleChange}
                            error={
                                addProductForm.touched.sku &&
                                Boolean(addProductForm.errors.sku)
                            }
                            helperText={
                                addProductForm.touched.sku &&
                                addProductForm.errors.sku
                            }
                            variant="standard"
                            autoFocus
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="text"
                            id="name"
                            name="name"
                            label="Name"
                            value={addProductForm.values.name}
                            onChange={addProductForm.handleChange}
                            error={
                                addProductForm.touched.name &&
                                Boolean(addProductForm.errors.name)
                            }
                            helperText={
                                addProductForm.touched.name &&
                                addProductForm.errors.name
                            }
                            variant="standard"
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="number"
                            id="stock"
                            name="stock"
                            label="Stock"
                            value={addProductForm.values.stock}
                            onChange={addProductForm.handleChange}
                            error={
                                addProductForm.touched.stock &&
                                Boolean(addProductForm.errors.stock)
                            }
                            helperText={
                                addProductForm.touched.stock && addProductForm.errors.stock
                            }
                            variant="standard"
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="number"
                            id="price"
                            name="price"
                            label="Price"
                            value={addProductForm.values.price}
                            onChange={addProductForm.handleChange}
                            error={
                                addProductForm.touched.price &&
                                Boolean(addProductForm.errors.price)
                            }
                            helperText={
                                addProductForm.touched.price && addProductForm.errors.price
                            }
                            variant="standard"
                        />
                        <TextField
                            autoComplete="off"
                            fullWidth
                            type="number"
                            id="purchase"
                            name="purchase"
                            label="Purchase"
                            value={addProductForm.values.purchase}
                            onChange={addProductForm.handleChange}
                            error={
                                addProductForm.touched.purchase &&
                                Boolean(addProductForm.errors.purchase)
                            }
                            helperText={
                                addProductForm.touched.purchase && addProductForm.errors.purchase
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
                                Save Product
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
    );
};

export default ProductHome;